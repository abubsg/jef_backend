const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // grab token from cookie
  const { token } = req.cookies;

  // if no token stop
  if (!token) {
    return res.status(403).send("not authorized, please log in");
  }

  // else decode token and get id
  try {
    const decode = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decode;
  } catch (error) {
    res.status(400).send("Invalid token");
  }

  return next();
};

// module.exports = function (req, res, next) {
//   const token = req.header("x-auth-token");
//   if (!token) return res.status(401).send("ACCESS DENIED. NO TOKEN AVAILABLE");
//   try {
//     const decode = jwt.verify(token, process.env.jwtPrivateKey);
//     req.user = decode;
//     next();
//   } catch (error) {
//     res.status(400).send("Invalid Token");
//   }
// };
