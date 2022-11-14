const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
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
})

module.exports = router;
