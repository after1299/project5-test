require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { connect } = require("http2");

mongoose
  .connect(
    "mongodb+srv://peter3403:peter1215@cluster0.ugoafy7.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connect to mongoDB atlas.");
  })
  .catch((err) => {
    console.log("connecting ERROR!!");
    console.log(err);
  });

// middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
