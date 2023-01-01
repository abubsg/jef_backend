const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationsSchema = new Schema(
  {
    donorFirst_name: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    donorLast_name: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    donorEmail: {
      type: String,
      maxLength: 50,
      minLength: 3,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
    },
    reference: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    recieptient: { type: String, default: null },
    purpose: { type: String, required: true, enum: ["donation", "sponsorship"] },
  },
  { timestamps: true }
);

module.exports = Donations = mongoose.model("donations", donationsSchema);
