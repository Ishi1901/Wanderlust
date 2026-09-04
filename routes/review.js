const express = require("express");
const router = express.Router({mergeParams:true})
const Review = require("../Models/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
 
}


// ****Review Routes*********

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();
    req.flash("success","Review created!")

  res.redirect(`/listings/${listing._id}`);
})
);


// Delete Review Route:

router.delete("/:reviewid",wrapAsync(async(req,res)=>{

    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid)
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);


}))


module.exports = router;