const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String, default: "listingimage" },
        url: { 
            type: String,
            default: "https://img.xcitefun.net/users/2014/07/362078,xcitefun-nature-beauty-9.jpg"
        }
    },
    price: {
        type: Number,
        required: true,
    },
    location: String,
    country: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
}, { timestamps: true });

listingSchema.post("findOneAndDelete",async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

