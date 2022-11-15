const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model")

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.post("/signup", async(req, res) => {
  // console.log(req.body);
  let {name, email, password} = req.body;
  const emailExist = await User.findOne({email});
  if(emailExist) {
    res.status(400).send("Email already exist.")
  } else {
    password = await bcrypt.hash(password, 10); // -> salting and hash the password
    let newUser = new User({name, email, password});
    try {
      const savedUser = await newUser.save();
      res.send({
        msg: "User saved.",
        savedObj: savedUser
      });
    } catch(err) {
      res.status(400).send(err);
      console.log("User not been saved.")
    }
  }
})

router.get("/logout", (req, res) => {
  let username = req.user.name;
  req.logOut((e) => {
    if (e) {
      console.log(e);
    } else {
      console.log(username + " has been log out.");
    }
  }); // -> method from passport.
  res.redirect("/");
});

router.get(
  "/google",
  passport.authenticate("google", {
    // -> https://www.passportjs.org/
    scope: ["profile"], // wanna get the doc from profile.
  }) // this is a middleware
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
