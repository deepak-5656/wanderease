const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const multer  = require("multer");
const upload = multer({ dest: "uploads/" });



router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings, searchQuery: null});
}));

router.get("/search", wrapAsync(async (req,res)=>{
    const { location, price, country } = req.query;
    let query = {};
    
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    if (country) {
        query.country = { $regex: country, $options: 'i' };
    }
    if (price) {
        query.price = { $lte: parseInt(price) };
    }
    
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs",{allListings, searchQuery: req.query});
}));

//new route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
})

//Show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);

   
    if (req.body.listing && req.body.listing.image) {
        newListing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
}));

// // update route 
// router.put("/listings/:id", async(req, res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// })

router.put("/:id", isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // Update text fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // If a new image is uploaded, update it
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename || "listingimage"
        };
    }

    // If user typed an image URL in text field, map to schema object
    if (req.body.listing && req.body.listing.image) {
        listing.image = {
            url: req.body.listing.image,
            filename: (listing.image && listing.image.filename) || "listingimage"
        };
    }

    // Else keep the old image – do nothing
    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports= router;


