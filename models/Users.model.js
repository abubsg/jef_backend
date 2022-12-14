const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.jwtPrivateKey,
    { expiresIn: "2h" }
  );
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().required().min(3).max(50),
    last_name: Joi.string().required().min(3).max(50),
    levelOfEduc: Joi.string(),
    email: Joi.string().required().min(3).max(50),
    phone: Joi.string().required().min(5).max(20),
    dob: Joi.date(),
    gender: Joi.string().required().min(3),
    address: Joi.object(),
    password: Joi.string().required().min(4).max(255),
    role: Joi.string(),
    amount: Joi.number().min(0),
    specialization: Joi.string(),
    registration: Joi.object(),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
