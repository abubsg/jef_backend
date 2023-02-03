const mongoose = require("mongoose");
const logger = require("./logging");

module.exports = function () {
  const uri_local = "mongodb://127.0.0.1:27017/jef";
  const uri_online = process.env.MONGO_URI;
  mongoose.set("strictQuery", true);
  let uri;
  // if (process.env.NODE_ENV === "production") {
  uri = uri_online;
  // console.log("production");
  // } else {
  //   uri = uri_local;
  //   console.log("development");
  // }

  mongoose.connect(uri).then(() => logger.info("MongoDB connected"));
};
