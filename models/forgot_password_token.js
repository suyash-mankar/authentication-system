const mongoose = require("mongoose");

const forgotPasswordTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 60 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPasswordToken = mongoose.model(
  "ForgotPasswordToken",
  forgotPasswordTokenSchema
);

module.exports = ForgotPasswordToken;
