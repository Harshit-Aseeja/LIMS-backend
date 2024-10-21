const data = require("./data").hods;
const createHODTable = async (connection) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS hods(id INT, department_id INT NOT NULL, FOREIGN KEY (department_id) REFERENCES department(id), FOREIGN KEY (id) references faculty(id));`
  );
};

const insertHODs = async (connection) => {
  for (let hods of data) {
    await connection.execute(
      `INSERT INTO hods(id, department_id) VALUES(?,?);`,
      [hods.facultyId, hods.departmentId]
    );
  }
};

const dropHODTable = async (connection) => {
  await connection.execute("DROP TABLE IF EXISTS hods;");
};

const seedHODs = async (connection) => {
  await createHODTable(connection);
  await insertHODs(connection);
  console.log("HODs Seeded");
};

module.exports.seedHODs = seedHODs;
module.exports.dropHODTable = dropHODTable;
