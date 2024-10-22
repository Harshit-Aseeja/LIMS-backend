const router = require("express").Router();

router.use("/labstaff", require("./labstaff"));
router.use("/hod", require("./hod"));
router.use("/student", require("./student"));
router.use("/inventory", require("./inventory"));
router.use("/api", require("./api"));
module.exports = router;
