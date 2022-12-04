const ForgotPasswordToken = require("../models/forgot_password_token");
const User = require("../models/user");
const crypto = require("crypto");
const queue = require("../config/kue");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const forgotPasswordEmailWorker = require("../workers/forgot_password_email_worker");

//sign in page
module.exports.signIn = function (req, res) {
  // if user is already logged in, redirect to user profile page
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Sign In",
  });
};

//sign up page
module.exports.signUp = function (req, res) {
  // if user is already logged in, redirect to user profile page
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

// create a user upon signup
module.exports.create = async function (req, res) {
  // check if password and confirm password match
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Passwords don't match");
    return res.redirect("back");
  }

  // verify the recaptcha
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body["g-recaptcha-response"]}`,
    {
      method: "POST",
    }
  );
  const captchaVerified = await response.json();

  // if captcha is unsuccessful
  if (!captchaVerified.success) {
    req.flash("error", "please check captcha");
    return res.redirect("back");
  }

  // find user in database with email id
  const user = await User.findOne({ email: req.body.email });

  // if user not present in db, create new user
  if (!user) {
    // hash the user password
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

// login user and redirect to profile page
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/users/profile");
};

// logout user
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "You have logged out");

  return res.redirect("/");
};

// create a forgot password token
module.exports.createForgotPasswordToken = async function (req, res) {
  try {
    // find user in database with email id
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let forgotPasswordToken = await ForgotPasswordToken.create({
        user: user._id,
        accessToken: crypto.randomBytes(20).toString("hex"),
        isValid: true,
      });
      // populate the user field
      forgotPasswordToken = await forgotPasswordToken.populate("user");
      // send mail to user
      // use parallel jobs (kue) to send job to workers
      let job = await queue
        .create("emails", forgotPasswordToken)
        .save(function (err) {
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

// render the reset forgot password page
module.exports.resetPasswordPage = async function (req, res) {
  // find the forgot password token in db using the access token
  let forgotPasswordToken = await ForgotPasswordToken.findOne({
    accessToken: req.params.accessToken,
  });

  // if token not found in db
  if (!forgotPasswordToken) {
    req.flash("error", "Token Expired");
    return res.redirect("/");
    // if token is not valid or expired
  } else if (
    !forgotPasswordToken.isValid ||
    forgotPasswordToken.expiresAt < Date.now()
  ) {
    // delete the token from db
    await ForgotPasswordToken.deleteOne({
      accessToken: req.params.accessToken,
    });
    req.flash("error", "Token Expired");
    return res.redirect("/");
  } else {
    return res.render("forgot_password_reset", {
      title: "reset password",
      forgotPasswordToken: forgotPasswordToken,
    });
  }
};

// reset forgot password
module.exports.forgotPasswordReset = async function (req, res) {
  try {
    // check if password and confirm password match
    if (req.body.password !== req.body.confirm_password) {
      req.flash("error", "passwords don't match");
      return res.redirect("back");
    }

    // find the token in db
    let forgotPasswordToken = await ForgotPasswordToken.findOne({
      accessToken: req.params.accessToken,
    });
    // populate the user field in token
    await forgotPasswordToken.populate("user");

    // if token in valid
    if (forgotPasswordToken.isValid) {
      // find the user
      let user = await User.findById(forgotPasswordToken.user._id);
      // set the new password in db after hashing
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        user.password = hash;
        user.save();
      });
      // set the validity of token as false
      forgotPasswordToken.isValid = false;
      forgotPasswordToken.save();
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

// render page to change password
module.exports.changePasswordPage = function (req, res) {
  return res.render("change_password", {
    title: "change password",
    userId: req.params.id,
  });
};

// change user password
module.exports.changePassword = async function (req, res) {
  // find the user
  let user = await User.findById(req.params.id);
  // change the password
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    user.password = hash;
    user.save();
  });
  req.flash("success", "Password changed successfully");
  return res.redirect("/");
};

// render forgot password page
module.exports.forgotPasswordPage = function (req, res) {
  return res.render("forgot_password", {
    title: "forgot password",
  });
};
