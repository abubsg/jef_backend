const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    // postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    // description: { type: String },
    // title: { type: String, required: true },
    upload: [Object],
    // startDate: { type: Date },
    // endDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = Gallery = mongoose.model("gallery", gallerySchema);
