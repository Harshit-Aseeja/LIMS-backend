const data = require("./data").lab_incharge;
const createLabInchargeTable = async (connection) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS lab_incharges(id INT,lab_id INT NOT NULL, FOREIGN KEY (lab_id) REFERENCES labs(id), FOREIGN KEY (id) references faculty(id));`
  );
};

const insertLabIncharges = async (connection) => {
  for (let lab_incharge of data) {
    await connection.execute(
      `INSERT INTO lab_incharges(id,lab_id) VALUES(?,?);`,
      [lab_incharge.facultyId, lab_incharge.labId]
    );
  }
  //   const [rows, fields] = await connection.execute(
  //     `SELECT id,name FROM faculty;`
  //   );
  // for (let i = 0; i < rows.length; i++) {
  //     const [rows1, fields1] = await connection.execute(
  //         `SELECT id FROM labs WHERE name = ?;`,
  //         [rows[i].name]
  //     );
  //     if (rows1.length > 0) {
  //         await connection.execute(
  //         `INSERT INTO lab_incharges(id,lab_id) VALUES(?,?);`,
  //         [rows[i].id, rows1[0].id]
  //         );
  //     }
  //     }
};

const dropLabInchargeTable = async (connection) => {
  await connection.execute("DROP TABLE IF EXISTS lab_incharges;");
};

const seedLabIncharge = async (connection) => {
  await createLabInchargeTable(connection);
  await insertLabIncharges(connection);
  console.log("Lab Incharges Seeded");
};

module.exports.seedLabIncharge = seedLabIncharge;
module.exports.dropLabInchargeTable = dropLabInchargeTable;
