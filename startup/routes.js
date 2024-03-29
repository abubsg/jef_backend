const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const error = require("../middleware/error");
const beneficiaries = require("../routes/api/beneficiaries");
const role = require("../routes/api/role");
const events = require("../routes/api/events");
const projects = require("../routes/api/projects");
const sponsors = require("../routes/api/sponsors");
const app_config = require("../routes/api/app_config");
const donations = require("../routes/api/donations");
const gallery = require("../routes/api/gallery");
// const courseRate = require("../routes/api/courseRating");
const user = require("../routes/api/User");
const fileUpload = require("express-fileupload");
const auth = require("../routes/api/auth");

module.exports = function (app) {
  app.use(fileUpload());
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());
  app.use(cookieParser());
  app.use("/api/beneficiaries", beneficiaries);
  app.use("/api/role", role);
  app.use("/api/events", events);
  app.use("/api/projects", projects);
  app.use("/api/sponsors", sponsors);
  app.use("/api/app_configs", app_config);
  app.use("/api/donations", donations);
  app.use("/api/gallery", gallery);
  // app.use("/api/courseRate", courseRate);
  app.use("/api/users", user);
  app.use("/api/auth", auth);

  // error handler
  app.use(error);
};
