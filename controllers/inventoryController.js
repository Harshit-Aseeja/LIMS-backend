const pool = require("../utils/db-config");
const sendEmail = require("../utils/mailHelper").sendEmail;
const { createInventoryTable, createIssueTable } = require("../seed/inventory");

module.exports.getInventoryHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const connection = pool;

    // Ensure tables exist
    await createInventoryTable(labId, connection);
    await createIssueTable(labId, connection);

    const [rows, fields] = await connection.execute(
      `SELECT * FROM inventory_${labId}`
    );
    const [incharges] = await connection.execute(
      `SELECT faculty.name as name, email, mobile, location, labs.name as labname FROM
       faculty JOIN lab_incharges ON faculty.id = lab_incharges.faculty_id
       JOIN labs ON labs.id = lab_incharges.lab_id 
       WHERE labs.id = ?;`,
      [labId]
    );
    //console.log(rows);
    return res.send({
      status: 200,
      message: "Incharge & Inventory fetched successfully",
      inventory: rows,
      incharge: {
        name: incharges[0].name,
        email: incharges[0].email,
        mobile: incharges[0].mobile,
        location: incharges[0].location,
        labName: incharges[0].labname,
      },
    });
  } catch (error) {
    console.log("Error in getInventoryHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in fetching lab incharge",
    });
  }
};

module.exports.updateInventoryHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const inventory = req.body;
    const connection = pool;

    // Ensure tables exist
    await createInventoryTable(labId, connection);
    await createIssueTable(labId, connection);

    const [rows, fields] = await connection.execute(
      `UPDATE inventory_${labId} SET name=?, model=?, total_qty=?, maker=?, specifications=? WHERE id=?`,
      [
        inventory.name,
        inventory.model,
        inventory.total_qty,
        inventory.maker,
        JSON.stringify(inventory.specifications),
        inventory.id,
      ]
    );
    return res.send({
      status: 200,
      message: "Inventory updated successfully",
    });
  } catch (error) {
    console.log("Error in updateInventoryHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in updating inventory",
    });
  }
};

module.exports.addInventoryHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const inventory = req.body;
    const connection = pool;

    // Ensure tables exist
    await createInventoryTable(labId, connection);
    await createIssueTable(labId, connection);

    const [rows, fields] = await connection.execute(
      `INSERT INTO inventory_${labId} (name, model, total_qty, maker, specifications) VALUES (?, ?, ?, ?, ?);`,
      [
        inventory.name,
        inventory.model,
        inventory.total_qty,
        inventory.maker,
        JSON.stringify(inventory.specifications),
      ]
    );
    return res.send({
      status: 200,
      message: "Inventory added successfully",
    });
  } catch (error) {
    console.log("Error in addInventoryHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in adding inventory",
    });
  }
};

module.exports.getIssuedInventoryHandler = async (req, res) => {
  try {
    const { labId } = req.params;
    const connection = pool;

    // Ensure tables exist
    await createInventoryTable(labId, connection);
    await createIssueTable(labId, connection);

    const [rows, fields] = await connection.execute(
      `SELECT * FROM issue_${labId} ORDER BY date DESC`
    );
    for (let i = 0; i < rows.length; i++) {
      const items = JSON.parse(rows[i].items);
      const items_array = [];
      for (let j = 0; j < items.length; j++) {
        const [item_rows, item_fields] = await connection.execute(
          `SELECT name, model FROM inventory_${labId} WHERE id=?`,
          [items[j].id]
        );
        items_array.push({
          name: item_rows[0].name,
          model: item_rows[0].model,
          quantity: items[j].quantity,
        });
      }
      rows[i].items = items_array;
    }
    return res.send({
      status: 200,
      message: "Issued Inventory fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.log("Error in getIssuedInventoryHandler:", error.message);
    return res.send({
      status: 400,
      message: "Error in fetching issued inventory",
    });
  }
};

module.exports.notifyHandler = async (req, res) => {
  const { name, roll_no, date, items, lab_id } = req.body;
  const [rows, fields] = await pool.execute(
    `SELECT name FROM labs WHERE id=?`,
    [lab_id]
  );
  const lab_name = rows[0].name;
  const subject = "Inventory Return Reminder";
  const message = `<h1>Dear ${name}, please return the items that you have issued from ${lab_name} on ${new Date(
    date
  ).toLocaleDateString("en-GB")}.</h1>
  <h2>Items:</h2>
  <ul>
  ${items.map((item) => {
    return `<li>${item.name} ${item.model} x ${item.quantity}</li>`;
  })}
  </ul>
  `;
  const body = {
    email: roll_no + "@lnmiit.ac.in",
    name: name,
    subject: subject,
    message: message,
  };
  const resp = await sendEmail(body);
  res.send({
    status: 200,
    message: resp.msg,
  });
};

module.exports.returnHandler = async (req, res) => {
  const { issue_id: id, lab_id } = req.body;
  const connection = pool;
  try {
    await createInventoryTable(lab_id, connection);
    await createIssueTable(lab_id, connection);

    const [rows, fields] = await connection.execute(
      `SELECT * FROM issue_${lab_id} WHERE id=?`,
      [id]
    );
    if (rows.length === 0) {
      return res.send({
        status: 400,
        message: "Inventory not found",
      });
    }

    const items = JSON.parse(rows[0].items);
    for (let i = 0; i < items.length; i++) {
      await connection.execute(
        `UPDATE inventory_${lab_id} SET issued_qty=issued_qty-? WHERE id=?`,
        [items[i].quantity, items[i].id]
      );
    }

    await connection.execute(`DELETE FROM issue_${lab_id} WHERE id=?`, [id]);
    return res.send({
      status: 200,
      message: "Inventory returned successfully",
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};
