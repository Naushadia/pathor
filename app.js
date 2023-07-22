var express = require("express");
var logger = require("morgan");
var dotenv = require("dotenv");
var mongoose = require("mongoose");

dotenv.config("./.env");

var app = express();

app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
