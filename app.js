if(process.env.NODE_ENV != "production"){
   require('dotenv').config()
}
// console.log(process.env.SECRET) 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


 
// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//index.ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=> {
  console.log("Error in Mongo session store",err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
};

/*
// rooot routestesting 
// app.get("/", (req, res) => {
//   res.send("Welcome to Wanderlust Api");
// });
*/




app.use(session(sessionOptions));
app.use(flash());

// Use in user.js for authentication'
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Make currentUser available in all views
  next();
});

/*
// Demo route to test 
// app.get("/demouser", async(req, res) =>{
//   let fakeUser = new User({
//     email:"sudhir@gmail.com",
//     username:"sudhir",
//   });
//  let registerUser = await User.register(fakeUser,"helloword")
//   res.send(registerUser);
// })
*/

// Router
// Listings and reviews routes for use in two lines 
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);

// This route 404 will catch all requests that do not match any of the above routes.
app.all("*",(req,res,next) =>{
  next(new ExpressError(404,"Page Not Found"));
}) 

// Middleware used to handle errors in Express applications.
app.use((err,req,res,next) =>{
  let {statusCode=500, message="Something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
});


app.listen(8000, () => {
  console.log("Server started on port:8000");
});

