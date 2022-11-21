const express = require("express");
const app = express();
const port = 5000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server", err);
  }
  console.log("server successfully started on port: ", port);
});
