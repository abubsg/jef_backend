const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectsSchema = new Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    address: { type: String },
    longitude: { type: String },
    latitude: { type: String },
    title: { type: String, required: true },
    upload: [Object],
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = Projects = mongoose.model("project", projectsSchema);
