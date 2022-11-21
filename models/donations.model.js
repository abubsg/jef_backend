const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationsSchema = new Schema(
  {
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
    },
    recieptient: { type: Schema.Types.ObjectId, ref: "Donee" },
    purpose: { type: String },
  },
  { timestamps: true }
);

module.exports = Donations = mongoose.model("donations", donationsSchema);
