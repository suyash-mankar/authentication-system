const ResetPasswordToken = require("../models/reset_password_token");
const User = require("../models/user");
const crypto = require("crypto");
const queue = require("../config/kue");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");

// sign in and create a session for the user
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Sign In",
  });
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Sign Up",
  });
};

module.exports.profile = function (req, res) {
  return res.render("users_profile", {
    title: "profile",
  });
};

module.exports.create = async function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Passwords don't match");
    return res.redirect("back");
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LcVgVEjAAAAAJa3WNSWAcAJb8Bbw08Yn_OpaW1u&response=${req.body["g-recaptcha-response"]}`,
    {
      method: "POST",
    }
  );

  const captchaVerified = await response.json();

  if (!captchaVerified.success) {
    req.flash("error", "please check captcha");
    return res.redirect("back");
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      });
    });
    req.flash("success", "User created successfully");
    return res.redirect("/users/sign-in");
  } else {
    return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/users/profile");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "You have logged out");

  return res.redirect("/");
};

module.exports.createResetPasswordToken = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let resetPasswordToken = await ResetPasswordToken.create({
        user: user._id,
        accessToken: crypto.randomBytes(20).toString("hex"),
        isValid: true,
      });

      resetPasswordToken = await resetPasswordToken.populate("user");

      // send mail to user
      // resetPasswordMailer.resetPassword(resetPasswordToken);
      let job = queue.create("emails", resetPasswordToken).save(function (err) {
        if (err) {
          console.log("error in creating a queue");
          return;
        }
        console.log("job enqueued", job.id);
      });

      req.flash("success", "Check your mail id to reset password");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error in creating reset password token", err);
    return res.redirect("back");
  }
};

module.exports.resetPasswordPage = async function (req, res) {
  let resetPasswordToken = await ResetPasswordToken.findOne({
    accessToken: req.params.accessToken,
  });

  console.log("resetPasswordToken", resetPasswordToken);

  if (
    !resetPasswordToken ||
    !resetPasswordToken.isValid ||
    resetPasswordToken.expiresAt < Date.now()
  ) {
    await ResetPasswordToken.deleteOne({ accessToken: req.params.accessToken });
    req.flash("error", "Token Expired");
    return res.redirect("/");
  } else {
    return res.render("reset_password", {
      title: "reset password",
      resetPasswordToken: resetPasswordToken,
    });
  }
};

module.exports.resetPassword = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      req.flash("error", "passwords don't match");
      return res.redirect("back");
    }

    let resetPasswordToken = await ResetPasswordToken.findOne({
      accessToken: req.params.accessToken,
    });

    await resetPasswordToken.populate("user");

    if (resetPasswordToken.isValid) {
      let user = await User.findById(resetPasswordToken.user._id);
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        user.password = hash;
        user.save();
      });
      resetPasswordToken.isValid = false;
      resetPasswordToken.save();
      req.flash("success", "Password changed successfully");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    if (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  }
};

module.exports.changePasswordPage = function (req, res) {
  return res.render("change_password", {
    title: "change password",
    userId: req.params.id,
  });
};

module.exports.changePassword = async function (req, res) {
  let user = await User.findById(req.params.id);
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    user.password = hash;
    user.save();
  });
  req.flash("success", "Password changed successfully");
  return res.redirect("/");
};

module.exports.forgotPasswordPage = function (req, res) {
  return res.render("forgot_password", {
    title: "forgot password",
  });
};
