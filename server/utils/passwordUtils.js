const bcrypt = require("bcrypt");

const hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password1, passowrd2) => {
  return await bcrypt.compare(password1, passowrd2);
};

module.exports = { hashPassword, comparePassword };
