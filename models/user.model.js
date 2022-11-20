const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const studeSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid", "expired"],
    default: "unpaid",
  },
  reference: {
    type: String,
  },
});

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
  levelOfEduc: {
    type: String,
    enum: ["Diploma", "BSc", "Post Grad"],
  },
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
  address: { type: Object },
  password: { type: String, minLength: 4, maxLength: 1024, required: true },
  role: { type: String, enum: ["student", "instructor", "admin"] },
  registration: {
    type: studeSchema,
  },
  gender: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  specialization: { type: String },
  amount: {
    type: Number,
    min: 0,
  },
  pic: {
    type: String,
    default: "assets/default.svg",
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

const User = mongoose.model("User", userSchema);

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

function validatePay(paymentDetail) {
  const schema = Joi.object({
    amount: Joi.number().required(),
    email: Joi.string().required(),
    first_name: Joi.string(),
  });
  return schema.validate(paymentDetail);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePay = validatePay;
