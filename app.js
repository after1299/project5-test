require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const { connect } = require("http2");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
const passport = require("passport");
const flash = require("connect-flash");
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
// app.use(cookieSession({
//   keys: [process.env.SECRET]
// }));
// this version passport must use "express-session" but not "cookie-session"
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // can get the locals parameter called "success_msg" which values saved in the flash key named "success_msg".
  res.locals.error_msg = req.flash("error_msg"); // req.flash("keys", "values")
  res.locals.error = req.flash("error"); // only for passport failureFlash.
  next();
})

// route must be placed in the last of the middleware.
app.use("/auth", authRoute);  // (Route with parameter) -> https://blog.gtwang.org/programming/learn-to-use-the-new-router-in-expressjs-4/
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index", {user: req.user});
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
