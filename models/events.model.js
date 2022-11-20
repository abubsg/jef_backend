const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    feedBack: {
      studentID: { type: Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: { type: String },
      suggestion: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = Events = mongoose.model("events", eventsSchema);
