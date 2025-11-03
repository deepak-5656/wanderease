const express = require("express");
require("dotenv").config();

const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategry = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

// Use environment variable for MongoDB connection or fallback to local
const MONGO_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/wanderease";

// MongoDB connection with better error handling
main()
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("Connection string (masked):", MONGO_URL.replace(/\/\/.*@/, "//*****@"));
    });

async function main() {
    await mongoose.connect(MONGO_URL, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
}
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));   

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 *60 *60 *1000,
        maxAge: 7 * 24 *60 *60 *1000,
        httpOnly: true,
    },
};


app.get("/", async (req, res) => {
    const allListings = await Listing.find({}).limit(3);
    res.render("home.ejs", { allListings });
});

app.use(session(sessionOptions));
app.use(flash());

//for authentication we use passport library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/demouser", async (req,res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "student"
    });

     let registeredUser = await User.register(fakeUser, "helloworld");
     res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/listings/:id/bookings",bookingRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
    // res.send("something went wrong");
});


app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});


