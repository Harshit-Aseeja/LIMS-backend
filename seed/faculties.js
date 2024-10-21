const faculties = require("./data").faculties;
const connection = require("../utils/db-config");

const createFacultyTable = async (connection) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS faculty(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,empId VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL, mobile VARCHAR(13) NOT NULL, password VARCHAR(255) NOT NULL);`
  );
};

const insertFaculties = async (connection) => {
  for (faculty of await faculties()) {
    await connection.execute(
      `INSERT INTO faculty(name,empId,email,mobile,password) VALUES(?,?,?,?,?)`,
      [
        faculty.name,
        faculty.empId,
        faculty.email,
        faculty.mobile,
        faculty.password,
      ]
    );
  }
};

const dropFacultyTable = async (connection) => {
  await connection.execute("DROP TABLE IF EXISTS faculty;");
};

const seedFaculty = async (connection) => {
  await createFacultyTable(connection);
  await insertFaculties(connection);
  console.log("Faculty Seeded");
};

module.exports.seedFaculty = seedFaculty;
module.exports.dropFacultyTable = dropFacultyTable;
