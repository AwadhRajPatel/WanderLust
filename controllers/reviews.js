const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// this controller is handle the create reviews
module.exports.createReviwe =async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    // console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully New Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

// this controller is handle the delete review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Review Delete!");

    res.redirect(`/listings/${id}`);
};