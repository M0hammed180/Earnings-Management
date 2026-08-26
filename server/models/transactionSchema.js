const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    message: String,
    name: String,
    sender: String,
    amount: Number,
    profit: Number,
    type: {
      type: String,
      enum: ["received", "send"],
      deafult: "received",
    },
    receivedAt: Date,
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
