const connection = require("../utils/db-config");

module.exports.dsHandler = async (req, res) => {
  try {
    const [rows, fields] = await connection.execute("SELECT id FROM labs");
    return res.send({
      status: 200,
      message: "Lab ids fetched successfully",
      labIds: rows,
    });
  } catch (error) {
    console.log("Error in getLabIdsHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in fetching lab ids",
    });
  }
};

module.exports.getInventoryHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const [rows, fields] = await connection.execute(
      `SELECT * FROM inventory_${labId} join `
    );

    const [incharges] = await connection.execute(
      `select * from faculty natural join lab_incharges where lab_incharges.lab_id = ?;`,
      [labId]
    );

    return res.send({
      status: 200,
      message: "Inventory fetched successfully",
      inventory: rows,
      incharge: incharges[0],
    });
  } catch (error) {
    console.log("Error in getInventoryHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in fetching inventory",
    });
  }
};

module.exports.getDepartmentsHandler = async (req, res) => {
  try {
    const [rows, fields] = await connection.execute(
      `SELECT department.id as id, department.name as dept_name,faculty.name as hod_name 
        FROM department join hods on department.id=hods.department_id 
        join faculty ON faculty.id=hods.faculty_id;`
    );
    //use these rows and join again with faculty table using id
    return res.json({
      status: 200,
      data: rows,
    });
  } catch (error) {
    console.log("Error in getAllDepartments:", error);
    return res.json({
      status: 500,
      message: "Internal server error",
    });
  }
};
module.exports.getAllLabsHandler = async (req, res) => {
  try {
    const [rows, fields] = await connection.execute(
      `SELECT labs.name as labName, location, lab_id, faculty.name, faculty.email FROM labs 
       JOIN hods ON labs.department_id=hods.department_id 
       JOIN lab_incharges ON lab_incharges.lab_id=labs.id 
       JOIN faculty ON faculty.id = lab_incharges.faculty_id`
    );
    return res.send({
      message: "Labs fetched successfully",
      labs: rows,
      status: 200,
    });
  } catch (error) {
    console.log("Error in getAllLabsHandler:", error.message);
    return res.status(400).send({
      message: "Error in fetching all labs",
    });
  }
};
module.exports.getLabsHandler = async (req, res) => {
  try {
    const id = req?.params?.labId;
    //console.log(id);

    const [rows, fields] = await connection.execute(
      `SELECT labs.name as labName, location, lab_id, faculty.name, faculty.email FROM labs 
       JOIN hods ON labs.department_id=hods.department_id 
       JOIN lab_incharges ON lab_incharges.lab_id=labs.id 
       JOIN faculty ON faculty.id = lab_incharges.faculty_id 
       WHERE labs.department_id = ?`,
      [id]
    );
    //console.log("Complete Query:", rows);

    return res.send({
      message: "Labs fetched successfully",
      labs: rows,
      status: 200,
    });
  } catch (error) {
    console.log("Error in getLabsHandler:", error.message);
    return res.status(400).send({
      message: "Error in fetching labs",
    });
  }
};
