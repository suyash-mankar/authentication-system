const User = require("../models/user");

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
