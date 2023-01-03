const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sponsorshipSchema = new Schema(
  {
    donorFirst_name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    donorLast_name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    donorEmail: {
      required: true,
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
    recieptient: { type: Schema.Types.ObjectId, ref: "Donee" },
    purpose: { type: String },
  },
  { timestamps: true }
);

module.exports = Sponsorships = mongoose.model("sponsorship", sponsorshipSchema);
