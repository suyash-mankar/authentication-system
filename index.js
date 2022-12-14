require("dotenv").config();
const express = require("express");
const env = require("./config/environment");
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
// to display flash messages on screen
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const sassMiddleware = require("node-sass-middleware");

// use scss
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

// set folder for static files
app.use(express.static("./assets"));

app.use(bodyParser.urlencoded({ extended: false }));

// set ejs as template engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayouts);

// extract style and script from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "authentication_system",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
    store: MongoStore.create(
      {
        mongoUrl: env.mongodb_url,
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

// use connect flash for flash messages
app.use(flash());
app.use(customMiddleware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server", err);
  }
  console.log("server successfully started on port: ", port);
});
