const router = require("express").Router();
const issueController = require("../controllers/issueController");
const { verifyToken } = require("../utils/jwtAuth");

// Route to fetch all issues for a specific lab
router.get(
  "/lab/:labId",
  verifyToken,
  issueController.getAllIssuesByLabHandler
);

// Route to fetch all issues made by a specific student across all labs
router.get(
  "/student/:studentId",
  verifyToken,
  issueController.getIssuesByStudentAcrossLabsHandler
);

// Route to fetch all issues made by a specific student in a specific lab
router.get(
  "/lab/:labId/student/:studentId",
  verifyToken,
  issueController.getIssuesByStudentInLabHandler
);

// Route to create a new issue
router.post("/create", verifyToken, issueController.createIssueHandler);

module.exports = router;
