const pool = require("../utils/db-config");
const { generateToken } = require("../utils/jwtAuth");
const { comparePasswords } = require("../utils/passwordsHelper");
const {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} = require("../utils/messages/login_messages");

module.exports.studentLoginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows, fields] = await pool.execute(
      `SELECT id, name, email, password, roll_number, mobile
       FROM student 
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED + " Email not found",
      });
    }

    const passwordIsValid = password === rows[0].password;

    if (!passwordIsValid) {
      return res.send({
        status: 401,
        message: LOGIN_FAILED + " Password is invalid",
      });
    }

    return res.send({
      status: 200,
      message: LOGIN_SUCCESS,
      token: await generateToken({ id: rows[0].id, type: "student" }),
      type: "student",
      data: {
        name: rows[0].name,
        email: rows[0].email,
        roll_number: rows[0].roll_number,
        mobile: rows[0].mobile,
      },
    });
  } catch (error) {
    console.log("Error in studentLoginHandler:", error.message);
    return res.send({
      status: 400,
      message: LOGIN_ERROR,
    });
  }
};

// Handles the verify token request for student
module.exports.studentVerifyHandler = async (req, res) => {
  if (res.locals.userType === "student")
    return res.send({
      status: 200,
      isValid: true,
    });
  return res.send({
    status: 401,
    isValid: false,
  });
};

module.exports.verifyHandler = async (req, res) => {
  if (res.locals.userType === "student")
    return res.send({
      status: 200,
      isValid: true,
    });
  return res.send({
    status: 401,
    isValid: false,
  });
};
