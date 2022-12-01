require('dotenv').config();
const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const bodyParser = require("body-parser");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "authentication_system",
    secret: "authsystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost:27017/authentication_system",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server", err);
  }
  console.log("server successfully started on port: ", port);
});
