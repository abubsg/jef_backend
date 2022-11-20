const mongoose = require("mongoose");
const logger = require("./logging");

module.exports = function () {
  const uri = "mongodb://localhost/jef";
  mongoose.connect(uri).then(() => logger.info("MongoDB connected"));
};
