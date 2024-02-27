const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMdlr = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // token = req.headers.authorization.substring("Bearer ".length);
      token = req.headers.authorization.split(" ")[1];

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await userModel.findById(decodedToken._id);

      // check if the token sender is existing in the mongodb
      if (!req.user) return res.status(401).json({ message: "Not authorized" });

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};

module.exports = authMdlr;
