const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: Number,
      unique: true,
      required: true,
    },

    balance: {
      type: Number,
      default: 50000,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
