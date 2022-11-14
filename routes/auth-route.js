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

module.exports = router;
