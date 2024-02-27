const jwt = require("jsonwebtoken");

const generateToken = (userDataPayload) => {
  const { _id, firstname, lastname } = userDataPayload;
  return jwt.sign({ _id, firstname, lastname }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateToken };
