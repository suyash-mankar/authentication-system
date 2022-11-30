const ResetPasswordToken = require("../models/reset_password_token");
const User = require("../models/user");
const crypto = require("crypto");
const resetPasswordMailer = require("../mailers/reset_password_mailer");

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

module.exports.create = function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Passwords don't match");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user while signup", err);
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signup", err);
          return;
        }
        req.flash("success", "User created successfully");
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
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

      await resetPasswordToken.populate("user");

      // send mail to user
      resetPasswordMailer.resetPassword(resetPasswordToken);

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

  if (resetPasswordToken.isValid) {
    return res.render("reset_password", {
      title: "reset password",
      resetPasswordToken: resetPasswordToken,
    });
  } else {
    req.flash("error", "Token Expired");
    return res.redirect("/");
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
      user.password = req.body.password;
      resetPasswordToken.isValid = false;
      resetPasswordToken.save();
      user.save();

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
