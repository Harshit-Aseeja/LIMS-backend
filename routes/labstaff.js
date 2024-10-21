const router = require("express").Router();
const labstaffController = require("../controllers/labstaffController");
const { verifyToken } = require("../utils/jwtAuth");

router.post("/login", labstaffController.loginHandler);
router.get("/login", verifyToken, labstaffController.verifyHandler);
// router.post("/issue", labstaffController.issueHandler);

module.exports = router;
