const router = require("express").Router();
const issueController = require("../controllers/issueController");
const { verifyToken } = require("../utils/jwtAuth");

// Route to fetch all issues for a specific lab
router.get("/lab/:labId", verifyToken, issueController.getIssuesByLabHandler);

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

// Route to update the status of an issue
router.patch(
  "/:issueId/status",
  verifyToken,
  issueController.updateIssueStatusHandler
);

// Route to update the details of an issue (including marking as complete)
router.patch(
  "/:issueId",
  verifyToken,
  issueController.updateIssueDetailsHandler
);

// Route to fetch an issue by its ID
router.get("/:issueId", verifyToken, issueController.getIssueByIdHandler);

// Route to send an email
router.post("/send-email", verifyToken, issueController.sendEmailHandler);

module.exports = router;
