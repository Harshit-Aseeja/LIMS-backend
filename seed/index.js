let connection = require("../utils/db-config");
const { seedDepartment } = require("./department");
const { dropDepartmentTable } = require("./department");
const { seedLabs } = require("./labs");
const { dropLabsTable } = require("./labs");
const { seedFaculty } = require("./faculties");
const { dropFacultyTable } = require("./faculties");
const { seedLabIncharge } = require("./lab_incharges");
const express = require("express");
const { dropLabInchargeTable } = require("./lab_incharges");
const { seedHODs } = require("./hod");
const { dropHODTable } = require("./hod");
const { dropIssueTable } = require("./issue");
const app = express();
app.listen(3010, () => {
  console.log("Server running on port 3010");
  doSomething();
});

const seed = async () => {
  await seedDepartment(connection); //also seeds the labs
  //and seed labs also seeds the inventories
  await seedFaculty(connection);
  await seedLabIncharge(connection);
  await seedHODs(connection);
};

const dropTables = async () => {
  await dropLabInchargeTable(connection);
  await dropHODTable(connection);
  await dropFacultyTable(connection);
  await dropLabsTable(connection); // because of the foreign key constrainst, we need to remove the lab tables first
  await dropDepartmentTable(connection);
  await dropIssueTable(connection);
};

const doSomething = async () => {
  await dropTables();
  await seed();
};
