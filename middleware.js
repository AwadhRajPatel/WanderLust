const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = async (req, res, next) => {
  if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl; // Store the original URL
  }
  next();
}

// This middleware checks if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of  this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

// This middleware validates the listing data
// Middleware to validate the listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Middleware to validate the review data using Joi schema
module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};

// Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
