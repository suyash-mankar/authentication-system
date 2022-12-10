const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const env = require("./environment");

// tell passport to use a new strategy for google login

passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_callback_url,
    },
    function (accessToken, refreshToken, profile, done) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }
        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          bcrypt.hash(
            crypto.randomBytes(20).toString("hex"),
            saltRounds,
            function (err, hash) {
              User.create(
                {
                  email: profile.emails[0].value,
                  password: hash,
                  name: profile.displayName,
                },
                function (err, user) {
                  if (err) {
                    console.log("error in creating user", err);
                    return;
                  }
                  return done(null, user);
                }
              );
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
