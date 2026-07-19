const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderAccount: {
      type: Number,
      required: true,
    },

    receiverAccount: {
      type: Number,
      required: true,
    },

    accountNumber: {
      type: Number,
      required: true,
    },

    receiverName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["Debit", "Credit"],
      required: true,
    },

    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);