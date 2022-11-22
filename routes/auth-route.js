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
    req.flash("error_msg", "Email has been already been registered."); // -> req.flash("keys", "values");
    res.redirect("/auth/signup");
  } else if(password.length < 8) {
    req.flash("error_msg", "Password is too short, password's length should be longer than 8.");
    res.redirect("/auth/signup");
  } else {
    password = await bcrypt.hash(password, 10); // -> salting and hash the password
    let newUser = new User({name, email, password});
    try {
      await newUser.save();
      req.flash("success_msg", "Registration succeeds. You can login now.");
      res.redirect("/auth/login");
    } catch(err) {
      console.log("User not been saved.");
      console.log(err.errors.name.properties.message);
      req.flash("error_msg", err.errors.name.properties.message);
      res.redirect("/auth/signup");
    }
  }
})

// https://www.passportjs.org/packages/passport-local/
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  failureFlash: "Your email or password is incorrect."
}), (req, res) => {
  res.redirect("/profile");
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
    scope: ["profile", "email"], // wanna get the doc from profile.
  }) // this is a middleware
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
