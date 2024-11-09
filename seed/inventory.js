const pool = require("../utils/db-config");

module.exports.createInventoryTable = async (id, connection) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS inventory_${id} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      model VARCHAR(255) NOT NULL,
      issued_qty INT NOT NULL DEFAULT 0,
      total_qty INT NOT NULL,
      maker VARCHAR(255) NOT NULL,
      specifications JSON NOT NULL
    );`
  );
};

module.exports.createIssueTable = async (id, connection) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS issue_${id} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_roll_no VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  remarks TEXT,
  items JSON NOT NULL
);
`
  );
};

module.exports.dropInventoryTable = async (id, connection) => {
  await connection.execute(`DROP TABLE IF EXISTS inventory_${id}`);
};

module.exports.seedInventory = async (connection, inventories, labId) => {
  await this.createInventoryTable(labId, connection);
  if (!inventories) return;
  for (let i = 0; i < inventories.length; i++) {
    await connection.execute(
      `INSERT INTO inventory_${labId} (name, model, total_qty, maker, specifications) VALUES (?,?,?,?,?);`,
      [
        inventories[i].name,
        inventories[i].model,
        inventories[i].quantity,
        inventories[i].maker,
        JSON.stringify(inventories[i].specifications),
      ]
    );
  }
};
