const router = require("express").Router();
const hodController = require("../controllers/hodController");
const { verifyToken } = require("../utils/jwtAuth");

router.post("/login", hodController.loginHandler);
//verifyToken is a middleware that verifies the token
//verifyHandler is a controller that sends the response whether the person is hod or not
router.get("/login", verifyToken, hodController.verifyHandler);
router.get("/labs", verifyToken, hodController.getLabsHandler);
router.post("/labs", verifyToken, hodController.addLabHandler);
module.exports = router;
