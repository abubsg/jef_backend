const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const doneeSchema = new mongoose.Schema({
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
    enum: [
      "Basic/Primary",
      "JSCE/Middle_school",
      "SSCE/High_school",
      "Diploma",
      "BSc",
      "Post Grad",
    ],
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
  dob: { type: Date, required: true },
  nationality: { type: Object },
  password: { type: String, minLength: 4, maxLength: 1024, required: true },
  role: { type: String, enum: ["widow", "orphan"] },
  gender: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  employment_history: { type: Object },
  bank_details: { type: Object },
  skills: { type: Object },
  validID: {
    id_type: { type: String, required: true },
    id_no: { type: String, required: true },
    pic: {
      type: String,
      default: "assets/default.svg",
    },
  },
  pic: {
    type: String,
    default: "assets/default.svg",
  },
});

doneeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.jwtPrivateKey,
    { expiresIn: "2h" }
  );
  return token;
};

const Donee = mongoose.model("Donee", doneeSchema);

function validateUser(donee) {
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

  return schema.validate(donee);
}

// function validatePay(paymentDetail) {
//   const schema = Joi.object({
//     amount: Joi.number().required(),
//     email: Joi.string().required(),
//     first_name: Joi.string(),
//   });
//   return schema.validate(paymentDetail);
// }

exports.Donee = Donee;
exports.validate = validateDonee;
// exports.validatePay = validatePay;
