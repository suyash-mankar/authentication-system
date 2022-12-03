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

    expiresAt: {
      type: Date,
      default: Date.now() + 60 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);

resetPasswordTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

const ResetPasswordToken = mongoose.model(
  "Reset_Password_Token",
  resetPasswordTokenSchema
);

module.exports = ResetPasswordToken;
