const router = require("express").Router();
const studentController = require("../controllers/studentController");
const { verifyToken } = require("../utils/jwtAuth");

router.post("/login", studentController.loginHandler);
//verifyToken is a middleware that verifies the token
//verifyHandler is a controller that sends the response whether the person is student or not
router.get("/login", verifyToken, studentController.verifyHandler);

module.exports = router;
