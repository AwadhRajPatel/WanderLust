const User = require("../models/user.js");


//this controller renders the signup form
module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
  }

//this controller handles user signup or registration
module.exports.signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      // Automatically log in the user after registration
      req.login(registeredUser, (err) => {
        if (err) {
         return next(err);
        }
      // req.flash("success", "Welcome to Wanderlust!");
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
      });

    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
}

// this controller renders the login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

//this controller handles user login
module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust to Login successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//this controller handles user logout
module.exports.logout =  (req, res ,next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged out successfully!");
      res.redirect("/listings");
    });
}