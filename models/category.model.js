const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model("category", CategorySchema);
