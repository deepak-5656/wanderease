const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");

// Create booking route
router.post("/", isLoggedIn, validateBooking, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (listing.owner && listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing!");
        return res.redirect(`/listings/${id}`);
    }

    // Calculate number of nights
    const checkIn = new Date(req.body.booking.checkIn);
    const checkOut = new Date(req.body.booking.checkOut);
    
    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
        req.flash("error", "Check-in date cannot be in the past!");
        return res.redirect(`/listings/${id}`);
    }
    
    if (checkOut <= checkIn) {
        req.flash("error", "Check-out date must be after check-in date!");
        return res.redirect(`/listings/${id}`);
    }
    
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    const totalPrice = listing.price * nights * req.body.booking.guests;

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
        listing: id,
        status: { $in: ["pending", "confirmed"] },
        $or: [
            {
                checkIn: { $lte: checkOut },
                checkOut: { $gte: checkIn }
            }
        ]
    });

    if (overlappingBookings.length > 0) {
        req.flash("error", "This listing is already booked for the selected dates!");
        return res.redirect(`/listings/${id}`);
    }

    const newBooking = new Booking({
        listing: id,
        guest: req.user._id,
        owner: listing.owner ? (listing.owner._id || listing.owner) : req.user._id,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: req.body.booking.guests,
        totalPrice: totalPrice,
        status: "pending"
    });

    await newBooking.save();
    req.flash("success", "Booking created successfully! Waiting for owner confirmation.");
    res.redirect(`/profile`);
}));

// Cancel booking route (for guest)
router.delete("/:bookingId", isLoggedIn, wrapAsync(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("guest");
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/profile");
    }

    // Check if user is the guest or owner
    if (!booking.guest._id.equals(req.user._id) && !booking.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to cancel this booking!");
        return res.redirect("/profile");
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/profile");
}));

// Confirm booking route (for owner)
router.patch("/:bookingId/confirm", isLoggedIn, wrapAsync(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("listing");
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/profile");
    }

    // Check if user is the owner
    if (!booking.owner.equals(req.user._id)) {
        req.flash("error", "Only the listing owner can confirm bookings!");
        return res.redirect("/profile");
    }

    booking.status = "confirmed";
    await booking.save();

    req.flash("success", "Booking confirmed!");
    res.redirect("/profile");
}));

module.exports = router;

