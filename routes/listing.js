const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
//this is use uploaded image form
const multer  = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

//useing router.route  for usein same path api differnce readability  code
//root router
router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    // this is image uploaded middleware use
    upload.single('listing[image]'),
    validateListing, //isko isloggedIN ke niche past karna hai
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// this is  router .route for  show route update route and delete route  use functionalities
router
  .route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

  
//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
