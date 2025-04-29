const Listing = require("../models/listing.js");

// This controller handles the listing routes in index routes
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// This controller handles the new listing form
// This controller renders the new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//this controler handles the show listing route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// this controller handles the Create listing route
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  
  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id;

  newListing.image = {url, filename};  // Image save and update ke liye hai
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

// this controller handles the edit listing route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found! for edit!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

// this controller handles the update listing route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};  
    await listing.save();
 }
  req.flash("success", "Successfully updated a listing!");
  res.redirect(`/listings/${id}`);
};

// this controller handles the delete listing route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Successfully Delete a listing!");
  res.redirect("/listings");
};
