require("dotenv").config();
module.exports = function () {
  if (!process.env.jwtPrivateKey) {
    throw new Error("FATAL ERROR: JWT private key is required");
  }
};
