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

module.exports.getIssuesByLabHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const connection = pool;

    if (!labId) {
      return res.status(400).send({
        status: 400,
        message: "Lab ID not provided in the request parameters",
      });
    }

    console.log(`Fetching issues for lab ID: ${labId}`);

    // Fetch all issues related to the provided lab_id
    const [issueRows] = await connection.execute(
      `SELECT * FROM issues WHERE lab_id = ? ORDER BY request_date DESC`,
      [labId]
    );

    console.log(`Fetched ${issueRows.length} issues`);

    // For each issue, fetch the inventory names
    for (const issue of issueRows) {
      try {
        console.log(`Raw items for issue ID ${issue.id}:`, issue.items);
        const items = Array.isArray(issue.items)
          ? issue.items
          : JSON.parse(issue.items);
        console.log(`Parsed items for issue ID ${issue.id}:`, items);

        for (const item of items) {
          const [inventory] = await connection.execute(
            `SELECT name FROM inventory_${labId} WHERE id = ?`,
            [item.inventoryId]
          );
          if (inventory.length > 0) {
            item.inventory_name = inventory[0].name;
          } else {
            item.inventory_name = "Unknown"; // Handle cases where inventory name is not found
          }
        }

        issue.items = items;
      } catch (parseError) {
        console.error(
          `Error parsing items for issue ID ${issue.id}:`,
          parseError
        );
        issue.items = []; // Set items to an empty array if parsing fails
      }
    }

    return res.send({
      status: 200,
      message: `All issues in lab ${labId} fetched successfully`,
      issues: issueRows,
    });
  } catch (error) {
    console.log("Error in getIssuesByLabHandler:", error.message);
    return res.status(400).send({
      status: 400,
      message: "Error fetching issues for the lab",
    });
  }
};

module.exports.getIssuesByStudentAcrossLabsHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const connection = pool;

    // Step 1: Fetch all issues made by the student
    const [issues] = await connection.execute(
      `SELECT id, lab_id, request_date, status, items FROM issues WHERE student_id = ? ORDER BY request_date DESC`,
      [studentId]
    );

    // Step 2: Iterate over each issue and fetch inventory details
    const result = [];
    for (const issue of issues) {
      // Step 2a: Check if 'items' is a string (if it is, parse it)
      let items = issue.items;
      if (typeof items === "string") {
        items = JSON.parse(items); // Parse the JSON string into an object
      }

      // Step 3: Fetch inventory names and quantities for each issue
      const itemDetails = await Promise.all(
        items.map(async (item) => {
          // Get the inventory name from the dynamically named inventory table using lab_id
          const [inventory] = await connection.execute(
            `SELECT name FROM inventory_${issue.lab_id} WHERE id = ?`,
            [item.inventoryId]
          );

          // Return the inventory name and quantity for this item
          return {
            inventory_name: inventory[0]?.name || "Unknown", // Fallback to "Unknown" if not found
            quantity: item.quantity,
          };
        })
      );

      // Push the issue along with the fetched inventory details
      result.push({
        issue_id: issue.id,
        request_date: issue.request_date,
        status: issue.status,
        items: itemDetails, // Array of inventory names and quantities
      });
    }

    // Return the result
    return res.send({
      status: 200,
      message: `All issues made by student ${studentId} across labs fetched successfully`,
      issues: result,
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
      issues: rows,
    });
  } catch (error) {
    console.log("Error in getIssuesByStudentInLabHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error fetching issues for the specified student in lab",
    });
  }
};

module.exports.updateIssueStatusHandler = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

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

    // Update the issue status in the database
    const [result] = await connection.execute(
      `UPDATE issues SET status = ? WHERE id = ?`,
      [status, issueId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: 404,
        message: "Issue not found",
      });
    }

    return res.send({
      status: 200,
      message: `Issue with ID ${issueId} updated successfully`,
    });
  } catch (error) {
    console.error("Error updating issue status:", error.message);
    return res.status(500).send({
      status: 500,
      message: "Error updating issue status",
    });
  }
};
