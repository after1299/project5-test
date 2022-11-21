const { now } = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

// https://www.passportjs.org/tutorials/google/session/
passport.serializeUser((user, done) => {
    done(null, user._id); // Only user id needs to be serialized.
    console.log("id has been serialized.");
})

passport.deserializeUser((_id, done) => {
    console.log("Deserializing now.");
    User.findById({_id}).then((user) => {
        console.log("Found user.");
        done(null, user);
    });
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
}, (accessToken, refreshToken, profile, done) => {
    // passport callback -> https://www.passportjs.org/packages/passport-google-oauth20/
    // console.log(profile);
    User.findOne({googleID: profile.id}).then((foundUser) => {
        if(foundUser) {
            console.log("User already exist.");
            done(null, foundUser);
        } else {
            new User({
                name: profile.displayName,
                googleID: profile.id,
                thumbnail: profile.photos[0].value,
                email: profile.emails[0].value
            }).save().then((newUser) => {
                console.log("New user created.");
                done(null, newUser);
            })
        }
    })
}))