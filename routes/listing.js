const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


// Index route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});

    res.render("index.ejs", { allListing });
  }),
);

// New route

router.get("/new", isLoggedIn, (req, res) => {
  res.render("newlist.ejs");
});

// Create route

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(440,"Send valid data")
    // } not requires since u have validate listings.

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listings");
  }),
);

// Edit route

router.get(
  "/:id/edit",
  isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing does not exsist!");
      res.redirect("/listings");
    } else {
      res.render("edit.ejs", { listing });
    }
  }),
);

// Update route

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
let listing = await Listing.findById(id);
// if(!listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error","you dont have permission to Edit")
//    return res.redirect(`/listings/${id}`)
// } for this creating a middleware
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`)
  }),
);

// Show route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    console.log(req.user);
    console.log(listing.owner);
    if (!listing) {
      req.flash("error", "listing does not exsist!");
      res.redirect("/listings");
    } else {
      res.render("show.ejs", { listing });
    }
  }),
);

// Delete route

router.delete(
  "/:id",
  isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
  }),
);

module.exports = router;
