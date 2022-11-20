const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseImage: {
      type: String,
      required: true,
    },
    courseDescription: { type: String, required: true },
    courseStartDate: { type: Date, required: true }, // duratoin
    courseEndDate: { type: Date, required: true }, // duratoin
    cost: { type: Number, required: false }, // cost of the cost
    status: { type: Boolean, default: false }, // to enable the admin suspend the course (isPublished)
    class: { type: String, required: true, enum: ["diploma", "grad", "postGrad"] }, // Dip, B.Sc, or post grad
    syllabus: [Object], // curicullum, grading
    grading: { type: Object, required: false }, // grading scheme for the course
    no_of_modules: { type: Number, required: false }, // no of modules for the course
    announcements: [Object], // announcements for the course
    liveSessions: { type: Array, required: false }, // office hours
    objectives: [String], //what the students will learn
    tags: [String], //tags for filter regarding courses with associations
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    capturedBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Array },
    approvedBy: { type: String },
  },
  { timestamps: true }
);

module.exports = Course = mongoose.model("courses", CourseSchema);
