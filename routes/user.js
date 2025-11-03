const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderEase!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true 
    }), 
    async (req, res) => {
        req.flash("success", "Welcome back to WanderEase!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

router.get("/profile", isLoggedIn, wrapAsync(async (req, res) => {
    const userListings = await Listing.find({ owner: req.user._id });
    const guestBookings = await Booking.find({ guest: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    
    res.render("users/profile.ejs", { 
        userListings, 
        guestBookings 
    });
}));

module.exports = router;

