module.exports.createIssueTable = async (connection, id) => {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS issue_${id}(id INT AUTO_INCREMENT PRIMARY KEY, student_name VARCHAR(255) NOT NULL, student_roll_no VARCHAR(255) NOT NULL, date DATE NOT NULL, items JSON NOT NULL);`
  );
};

module.exports.dropIssueTable = async (connection, id) => {
  await connection.execute(`DROP TABLE IF EXISTS issue_${id}`);
};
