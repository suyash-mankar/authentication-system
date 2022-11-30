const mongoose = require("mongoose");

const resetPasswordTokenSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const ResetPasswordToken = mongoose.model(
  "Reset_Password_Token",
  resetPasswordTokenSchema
);

module.exports = ResetPasswordToken;
