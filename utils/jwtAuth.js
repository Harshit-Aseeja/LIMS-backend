require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

// Generates the token
module.exports.generateToken = async (data) => {
  try {
    const token = await jwt.sign(data, JWT_SECRET, {
      expiresIn: "2d",
    });
    return token;
  } catch (error) {
    console.log("Error in generateToken:", error);
  }
};

// Verifies the token
module.exports.verifyToken = async (req, res, next) => {
  try {
    const data = req.headers.authorization;
    //console.log(data);
    await jwt.verify(data, JWT_SECRET, (err, verifiedToken) => {
      if (err) {
        return res.send({
          status: 401,
          message: "User Authentication Failed",
          isValid: false,
        });
      }
      res.locals.userId = verifiedToken.id;
      res.locals.userType = verifiedToken.type;
      next();
    });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      isValid: false,
    });
  }
};
