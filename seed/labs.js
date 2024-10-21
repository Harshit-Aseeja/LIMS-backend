const { seedInventory, dropInventoryTable } = require("./inventory");
const { createIssueTable } = require("./issue");
const { dropIssueTable } = require("./issue");
module.exports.seedLabs = async (connection, department, departmentId) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS labs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, department_id INT NOT NULL, location VARCHAR(45) NOT NULL,FOREIGN KEY (department_id) REFERENCES department(id));`
  );
  const labs = department.labs;
  for (let i = 0; i < labs.length; i++) {
    const res = await connection.execute(
      `INSERT INTO labs (name,department_id, location) VALUES (?,?,?);`,
      [labs[i].name, departmentId, "Room: 123"]
    );
    await seedInventory(connection, labs[i].inventories, res[0].insertId);
    await createIssueTable(connection, res[0].insertId);
  }
};

module.exports.dropLabsTable = async (connection) => {
  // select all the tables in labs and drop the inventory_id tables
  const [rows, fields] = await connection.execute(`SELECT id FROM labs;`);
  for (let i = 0; i < rows.length; i++) {
    await dropInventoryTable(rows[i].id, connection);
    await dropIssueTable(connection, rows[i].id);
  }

  await connection.execute(`DROP TABLE IF EXISTS labs;`);
};
