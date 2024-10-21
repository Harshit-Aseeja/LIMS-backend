const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.createHash = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

module.exports.comparePasswords = async (enteredPassword, password) => {
  const result = await bcrypt.compare(enteredPassword, password);
  return result;
};
