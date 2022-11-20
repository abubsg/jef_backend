const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("ACCESS DENIED. NO TOKEN AVAILABLE");
  try {
    const decode = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
