const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    title: { type: String, required: true },
    upload: [Object],
    startDate: { type: Date },
    endDate: { type: Date },
    longitude: { type: String },
    latitude: { type: String },
    projectStatus: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = Events = mongoose.model("events", eventsSchema);
