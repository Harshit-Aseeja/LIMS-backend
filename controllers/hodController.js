const pool = require("../utils/db-config");
const { comparePasswords } = require("../utils/passwordsHelper");
const { generateToken } = require("../utils/jwtAuth");
const {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_ERROR,
} = require("../utils/messages/login_messages");
const { sendEmail } = require("../utils/emailService");

// Handles the login request from HOD
module.exports.loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("password: ", password);
    const [rows, fields] = await pool.execute(
      `select hods.id as id, faculty.name as name, email, password, department.name as dept 
      from faculty join hods on faculty.id = hods.faculty_id 
      join department on department.id = hods.department_id where email=?`,
      [email]
    );
    if (rows.length === 0) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED + " Email not found",
      });
    }
    //console.log(rows[0].password);
    const passwordIsValid = password === rows[0].password;

    if (!passwordIsValid) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED + " password is invalid",
      });
    }

    return res.send({
      status: 200,
      message: LOGIN_SUCCESS,
      token: await generateToken({ id: rows[0].id, type: "hod" }),
      type: "hod",
      data: {
        name: rows[0].name,
        email: rows[0].email,
        dept: rows[0].dept,
      },
    });
  } catch (error) {
    console.log("Error in loginHandler:", error.message);
    return res.send({
      status: 400,
      message: LOGIN_ERROR,
    });
  }
};

// Handles the verify token request
module.exports.verifyHandler = async (req, res) => {
  if (res.locals.userType === "hod")
    return res.send({
      status: 200,
      isValid: true,
    });
  return res.send({
    status: 401,
    isValid: false,
  });
};

module.exports.getLabsHandler = async (req, res, next) => {
  try {
    const [rows, fields] = await pool.execute(
      `SELECT labs.name as labName,location,lab_id,faculty.name,email,mobile FROM labs 
      join hods ON labs.department_id=hods.department_id 
      join lab_incharges on lab_incharges.lab_id=labs.id 
      join faculty on faculty.id = lab_incharges.faculty_id
      where hods.id = ?;`,
      [res.locals.userId]
    );
    return res.send({
      status: 200,
      labs: rows,
    });
  } catch (error) {
    console.log("Error in getLabsHandler:", error.message);
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

// Handles the add lab request
module.exports.addLabHandler = async (req, res, next) => {
  try {
    const { labName, Lab_Incharge_Email, Lab_Room, dept_name } = req.body;
    //console.log(req.body);
    const [rows, fields] = await pool.execute(
      `SELECT id FROM department WHERE name=?;`,
      [dept_name]
    );
    // if department does not exist
    if (rows.length === 0) {
      return res.send({
        status: 400,
        message: "Department does not exist!",
      });
    }

    // if lab already exists
    const [rows4, fields4] = await pool.execute(
      `SELECT id FROM labs WHERE name=?;`,
      [labName]
    );
    if (rows4.length !== 0) {
      return res.send({
        status: 400,
        message: "Lab already exists!",
      });
    }

    // if no such  faculty exist
    const [lab_incharge] = await pool.execute(
      `SELECT name, id FROM faculty WHERE email=?;`,
      [Lab_Incharge_Email]
    );
    //console.log(lab_incharge);

    if (lab_incharge.length === 0) {
      return res.send({
        status: 400,
        message: "This email is not registerd with any faculty!",
      });
    }

    // if to be lab incharge is hod of some other department
    const [rows2, fields2] = await pool.execute(
      `SELECT id FROM hods WHERE id=?;`,
      [lab_incharge[0].id]
    );
    if (rows2.length !== 0) {
      return res.send({
        status: 400,
        message: "This faculty is hod of some other department!",
      });
    }

    const department_id = rows[0].id;
    //console.log(lab_incharge[0].name);
    const [rows1, fields1] = await pool.execute(
      `INSERT INTO labs (name,department_id,location, lab_incharge) VALUES (?,?,?,?);`,
      [labName, department_id, "Room " + Lab_Room, lab_incharge[0].name]
    );

    const lab_id = rows1.insertId;
    const id = lab_incharge[0].id;
    const [rows3, fields3] = await pool.execute(
      `INSERT INTO lab_incharges (faculty_id,lab_id) VALUES (?,?);`,
      [id, lab_id]
    );

    // send email to lab incharge to inform about the lab
    const mail = {
      name: lab_incharge[0].name,
      email: Lab_Incharge_Email,
      subject: "Lab Added Successfully!",
      message: `Hello ${Lab_Incharge_Email},<br><br>
      You have been assigned as the incharge of the lab ${labName}.<br><br>
      Regards,<br>
      Inventory Management System Team`,
    };
    await sendEmail(mail);

    return res.send({
      status: 200,
      message: "Lab added successfully!",
    });
  } catch (error) {
    console.log("Error in addLabHandler:", error.message);
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};
