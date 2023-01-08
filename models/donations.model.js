const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationsSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      maxLength: 50,
      minLength: 3,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
    },
    flw_ref: {
      type: String,
      required: true,
    },
    tx_ref: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    transaction_id: {
      type: String,
      required: true,
    },
    currency: { type: String, required: true },
    purpose: {
      type: String,
      // required: true,
      enum: ["donation", "sponsorship"],
    },
    doneeID: {
      type: String,
    },
    doneeName: {
      type: String,
    },
    role: {
      type: String,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = Donations = mongoose.model("donations", donationsSchema);
