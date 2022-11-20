const express = require("express");
const cors = require("cors");
const error = require("../middleware/error");
const course = require("../routes/api/course");
const category = require("../routes/api/category");
const enroll = require("../routes/api/enrollRoute");
const lecture = require("../routes/api/lecture");
const discussion = require("../routes/api/discussion");
const courseRate = require("../routes/api/courseRating");
const user = require("../routes/api/users");
const fileUpload = require("express-fileupload");
const auth = require("../routes/api/auth");

module.exports = function (app) {
  app.use(fileUpload());
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());
  app.use("/api/courses", course);
  app.use("/api/categories", category);
  app.use("/api/lectures", lecture);
  app.use("/api/discussions", discussion);
  app.use("/api/courseRate", courseRate);
  app.use("/api/enroll", enroll);
  app.use("/api/users", user);
  app.use("/api/auth", auth);

  // error handler
  app.use(error);
};
