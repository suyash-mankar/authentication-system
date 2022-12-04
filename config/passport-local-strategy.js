const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      let user = await User.findOne({ email: email });

      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body["g-recaptcha-response"]}`,
        {
          method: "POST",
        }
      );

      const captchaVerified = await response.json();

      if (!captchaVerified.success) {
        req.flash("error", "please check captcha");
        return done(null, false);
      }

      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            return done(null, user);
          } else {
            req.flash("error", "Invalid Username/Password");
            return done(err, false);
          }
        });
      } else {
        req.flash("error", "Invalid Username/Password");
        return done(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("error in finding user --> Passport");
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = passport;

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in, pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};
