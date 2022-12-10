const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://suyashmankar:${process.env.MONGODB_ATLAS_PASS}@cluster0.biqbhsa.mongodb.net/?retryWrites=true&w=majority`
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function () {
  console.log("connected to database :: MongoDB");
});

module.exports = db;
