const mongoose = require("mongoose");
const logger = require("./logging");

module.exports = function () {
  const uri = "mongodb://127.0.0.1:27017/jef";
  mongoose.connect(uri).then(() => logger.info("MongoDB connected"));
};
