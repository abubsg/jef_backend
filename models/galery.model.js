const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    upload: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("gallry", gallerySchema);
