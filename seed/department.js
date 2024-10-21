const seedLabs = require("./labs").seedLabs;
const data = require("./data.js").departments;
const dropDepartmentTable = async (connection) => {
  const res = await connection.execute("DROP TABLE IF EXISTS department;");
};

const createDepartmentTable = async (connection) => {
  //Create table department if not exists
  await connection.execute(
    "CREATE TABLE IF NOT EXISTS department (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);"
  );
};

const insertDepartment = async (index, connection) => {
  //Insert into table department
  const res = await connection.execute(
    "INSERT INTO department (name) VALUES (?);",
    [data[index].name]
  );
  const departmentId = res[0].insertId;
  await seedLabs(connection, data[index], departmentId);
};

const seedDepartment = async (connection) => {
  await createDepartmentTable(connection);
  //Insert into table department
  for (let i = 0; i < data.length; i++) {
    await insertDepartment(i, connection);
  }
  console.log("Department seeded");
};
module.exports.seedDepartment = seedDepartment;
module.exports.dropDepartmentTable = dropDepartmentTable;
