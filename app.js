require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { connect } = require("http2");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile")
require("./config/passport") // -> will import middleware into this app.js from passport.js

mongoose
  .connect(
    process.env.CONNECT_DB,
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
app.use("/auth", authRoute);  // (Route with parameter) -> https://blog.gtwang.org/programming/learn-to-use-the-new-router-in-expressjs-4/
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
