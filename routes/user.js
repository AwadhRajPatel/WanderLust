const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// this is router.route for useing same path renderSignupForm and signup functional use this
router
  .route("/signup")
  // renderSignupForm route
  .get(userController.renderSignupForm)
  // signup route
  .post(wrapAsync(userController.signup));

/*
router.get("/signup", userController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(userController.signup),
);
*/

// this is router.route for useing same path loginfrom and login functional use this
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

  
/*
// Login route
router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);
*/

// Logout route
router.get("/logout", userController.logout);

module.exports = router;


//username:awadhrajpatel95
// oEYKwGmCgm7Rvdoj
// mongodb+srv://awadhrajpatel95:oEYKwGmCgm7Rvdoj@cluster0.esr4sio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0