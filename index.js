const express = require("express");
const app = express();
const port = 8000;

app.use("/", require("routes"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server", err);
  }
  console.log("server successfully started on port: ", port);
});
