const mongoose = require("mongoose");
const logger = require("./logging");

module.exports = function () {
  const uri = "mongodb://localhost/e_learning";
  mongoose.connect(uri).then(() => logger.info("MongoDB connected"));
};
