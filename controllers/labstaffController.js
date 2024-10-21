const pool = require("../utils/db-config");
const { generateToken } = require("../utils/jwtAuth");
const { comparePasswords } = require("../utils/passwordsHelper");
const {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} = require("../utils/messages/login_messages");

// Handles the login request from lab staff
module.exports.loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows, fields] = await pool.execute(
      `SELECT * FROM faculty join lab_incharges on faculty.id = lab_incharges.faculty_id WHERE email=?`,
      [email]
    );

    // if no user found with the given email id
    if (rows.length === 0) {
      return res
        .send({
          status: 401,
          message: LOGIN_FAILED + " no records found...",
        })
        .status(401);
    }

    // if the password is incorrect
    const passwordIsValid = rows[0].password === password;
    if (!passwordIsValid) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED + " wrong password " + rows[0].password,
      });
    }

    if (rows.length === 0) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED,
      });
    } else {
      rows[0].password = undefined;
      return res.send({
        status: 200,
        message: LOGIN_SUCCESS,
        token: await generateToken({ id: rows[0].id, type: "labstaff" }),
        type: "labstaff",
        data: {
          name: rows[0].name,
          email: rows[0].email,
          lab_id: rows[0].lab_id,
          empId: rows[0].empId,
        },
      });
    }
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

// Handles the verify token request
module.exports.verifyHandler = async (req, res) => {
  return res.send({
    status: 200,
    message: "User Authentication Successful",
    isValid: true,
    type: res.locals.userType,
  });
};
