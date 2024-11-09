const pool = require("../utils/db-config");

module.exports.createIssueHandler = async (req, res) => {
  try {
    const { student_id, lab_id, start_date, end_date, items, status } =
      req.body;

    // Get current date for `request_date` field
    const request_date = new Date().toISOString().slice(0, 10);

    // Validate `status` input
    const validStatuses = ["completed", "ongoing", "rejected", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({
        status: 400,
        message:
          "Invalid status value. Choose from 'completed', 'ongoing', 'rejected', or 'pending'.",
      });
    }

    const connection = pool;

    // Insert the new issue into the database
    await connection.execute(
      `INSERT INTO issues (student_id, lab_id, start_date, end_date, request_date, items, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        lab_id,
        start_date,
        end_date,
        request_date,
        JSON.stringify(items),
        status,
      ]
    );

    return res.send({
      status: 200,
      message: "Issue created successfully",
    });
  } catch (error) {
    console.error("Error creating issue:", error.message);
    return res.status(500).send({
      status: 500,
      message: "Error in creating issue",
    });
  }
};

module.exports.getAllIssuesByLabHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const connection = pool;

    // Fetch all issues for the specified lab
    const [rows] = await connection.execute(
      `SELECT * FROM issues WHERE lab_id = ? ORDER BY request_date DESC`,
      [labId]
    );

    return res.send({
      status: 200,
      message: `Issues for lab ${labId} fetched successfully`,
      data: rows,
    });
  } catch (error) {
    console.log("Error in getAllIssuesByLabHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error fetching issues for the specified lab",
    });
  }
};

module.exports.getIssuesByStudentAcrossLabsHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const connection = pool;

    // Fetch all issues made by the student across all labs
    const [rows] = await connection.execute(
      `SELECT * FROM issues WHERE student_id = ? ORDER BY request_date DESC`,
      [studentId]
    );

    return res.send({
      status: 200,
      message: `All issues made by student ${studentId} across labs fetched successfully`,
      data: rows,
    });
  } catch (error) {
    console.log("Error in getIssuesByStudentAcrossLabsHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error fetching issues by student across labs",
    });
  }
};

module.exports.getIssuesByStudentInLabHandler = async (req, res) => {
  try {
    const { labId, studentId } = req.params;
    const connection = pool;

    // Fetch all issues for the specified lab and student
    const [rows] = await connection.execute(
      `SELECT * FROM issues WHERE lab_id = ? AND student_id = ? ORDER BY request_date DESC`,
      [labId, studentId]
    );

    return res.send({
      status: 200,
      message: `Issues for student ${studentId} in lab ${labId} fetched successfully`,
      data: rows,
    });
  } catch (error) {
    console.log("Error in getIssuesByStudentInLabHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error fetching issues for the specified student in lab",
    });
  }
};
