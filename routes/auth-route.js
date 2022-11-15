const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  let username = req.user.name;
  req.logOut(e => {
    if(e) {
      console.log(e);
    } else {
      console.log(username + " has been log out.")
    }
  }); // -> method from passport.
  res.redirect("/");
})

router.get(
  "/google",
  passport.authenticate("google", {
    // -> https://www.passportjs.org/
    scope: ["profile"], // wanna get the doc from profile.
  }) // this is a middleware
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/profile");
})

module.exports = router;
