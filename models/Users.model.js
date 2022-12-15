const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  name: { type: String },
  email: {
    required: true,
    type: String,
    unique: true,
    maxLength: 50,
    minLength: 3,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxLength: 20,
    minLength: 5,
  },
  dob: { type: Date },
  password: { type: String, minLength: 4, maxLength: 1024, required: true },
  role: { type: String, enum: ["admin", "volunteer", "staff"] },
  gender: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  token: { type: String, default: null },
});

module.exports = mongoose.model("user", userSchema);
