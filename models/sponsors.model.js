const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema(
  {
    email: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    occupation: { type: String },
  },
  { timestamps: true }
);

module.exports = Events = mongoose.model("events", eventsSchema);
