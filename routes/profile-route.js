const router = require("express").Router();

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect("/auth/login");
    } else {
        console.log(req.user);
        next();
    }
}

router.get("/", authCheck, (req, res) => {
    res.render("profile", {user: req.user});
})

module.exports = router;