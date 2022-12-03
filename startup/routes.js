const express = require("express");
const cors = require("cors");
const error = require("../middleware/error");
const beneficiaries = require("../routes/api/beneficiaries");
const role = require("../routes/api/role");
const events = require("../routes/api/events");
const sponsors = require("../routes/api/sponsors");
// const discussion = require("../routes/api/discussion");
// const courseRate = require("../routes/api/courseRating");
const user = require("../routes/api/users");
const fileUpload = require("express-fileupload");
const auth = require("../routes/api/auth");

module.exports = function (app) {
  app.use(fileUpload());
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());
  app.use("/api/beneficiaries", beneficiaries);
  app.use("/api/role", role);
  app.use("/api/events", events);
  app.use("/api/sponsor", sponsors);
  // app.use("/api/discussions", discussion);
  // app.use("/api/courseRate", courseRate);
  app.use("/api/users", user);
  app.use("/api/auth", auth);

  // error handler
  app.use(error);
};
