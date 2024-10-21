const router = require("express").Router();
const apiController = require("../../controllers/apiController");

router.get("/labs", apiController.getAllLabsHandler);
router.get("/labs/:labId", apiController.getLabsHandler);
router.get("/departments", apiController.getDepartmentsHandler);

module.exports = router;
