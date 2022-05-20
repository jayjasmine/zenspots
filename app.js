//csurf
var bodyParser = require('body-parser');
var csurf = require('csurf');

const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  join
} = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./helpers/ExpressError");
const methodOverride = require("method-override");
const AppError = require("./AppError");
const rateLimit = require("express-rate-limit");
const Log = require("./models/log");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


//routes
const zenspotRoutes = require("./routes/zenspots");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/adminRoutes")

const app = express();


// Enable middleware for JSON and urlencoded form data
//helps server undersdtand json data
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))



//Code for views
app.engine("ejs", ejsMate);
//set view engine to ejs
app.set("view engine", "ejs");
//set views folder to current directory of this file(app.js) and look for the folder views
app.set("views", path.join(__dirname, "views"));

//Point app to use public folder for assets/css
app.use(express.static(path.join(__dirname, "public")));


////////////////////////////////////////////////////////////////////////////////////////////////////
//Denote where and explain why you instantiated the database and session objects in that location///
////////////////////////////////////////////////////////////////////////////////////////////////////
// Database and Session code are instantiated early in the file due to subsequent code relying on the database and sessions to be functional.
// An example of this is authentication functionality using Passport. 
// Passport requires the database to be instantiated beforehand so that it can read and create documents relating to users.
// Passport also requires sessions to be already initialized so it can to handle user sessions.
// This is why the Database and Session are instatiated early, to ensure dependencies like Passport can function.

/////////////////////////////////////////
///////     Connect Database       //////
/////////////////////////////////////////
const conn = require('./db');
conn.connect();


/////////////////////////////////////////
///////     Session code           //////
/////////////////////////////////////////

const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  //store
  cookie: {
    httpOnly: true,
    //expire in a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
};



//Create sessionid so use auth code (passport) later can function 
app.use(session(sessionConfig));


//Domain lock: whitelist all origins
app.use(
  cors({
    origin: "*",
  })
);


//Initialize passport on every route call
app.use(passport.initialize());
//Allow passport to use "express-session".
app.use(passport.session());
//Tell passport to use the Local Strategy(authenticating by comparing with username and password store in DB) and point to to User model
passport.use(new LocalStrategy(User.authenticate()));
//Passport will serialize and deserialize user instances to and from the session
//Tell passport how to serialize user (how to store user in the session)
passport.serializeUser(User.serializeUser());
//Tell passport how to remove user from session
passport.deserializeUser(User.deserializeUser());




//////////////////////////////////////////////////////////////////
///////     Middleware (runs code before every request)     //////
//////////////////////////////////////////////////////////////////


//Flash messages after action
app.use(flash());

//Tell express to parse request body
app.use(express.urlencoded({
  extended: true
}));

//set string to use methodOverride to fake HTTP requests
app.use(methodOverride("_method"));

//IP Rate limiter
const IPlimiter = rateLimit({
  windowMs: 1000 * 60 * 60 * 24, // This equates to 24 hours(1000ms * 60 = 1 minute, 1 minute x 60 = 1 hour, 1 hour * 24 = 24 hours))
  max: 1000, // Limit each IP to 1000 requests within the duration defined by the  windowMs property (24hours in this case)
  delayMs: 0, // disables delays
});
app.use(IPlimiter);

//Session Rate limiter
const sessionLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each session request per windowMs (5 for debug purposes)
  keyGenerator: (req, res) => req.sessionID, //use session as identifier
});
app.use(sessionLimiter);

//Logging middleware
app.use(async (req, res, next) => {
  const datetime = new Date()
    .toISOString()
    .replace(/T/, " ") // replace T with a space
    .replace(/\..+/, ""); // delete the dot and everything after
  //default values if no user logged in
  let username = "anonymous";
  let usertype = "user";
  //if user logged in set variables to req.user properties
  if (req.user) {
    username = req.user.username;
    usertype = req.user.usertype;
  }
  //create new log
  let log = new Log({
    ip: req.ip,
    sid: req.sessionID,
    username: username,
    usertype: usertype,
    timestamp: datetime,
    action: req.method,
    endpoint: req.path,
  });
  // console.log(log);
  //save to the database
  log.save();
  next();
});

//On every request, whatever is in flash object under success save to locals under the key sucess
app.use((req, res, next) => {
  //give all templates access to currently signed in user details
  res.locals.signedInUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//CSRF MITIGATION//
// app.use(csurf());
// app.use(function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   console.log(res.locals)
//   next();
// })


app.use((error, req, res, next) => {
  if(err.code === 'EBADCSRFTOKEN') {
      return res.sendStatus(403);
  }
  return next(error);
});


/////// End Middleware ///////

///////////////////////////////
///////     Routes       //////
///////////////////////////////

//express-router code to slim route paths
app.use("/", userRoutes);
app.use("/zenspots", zenspotRoutes);
app.use("/zenspots/:id/comments", commentRoutes);
app.use("/", adminRoutes);


//Home page
app.get("/", (req, res) => {
  //EJS render() to render home.ejs
  res.render("home");
});

//for all requests, and all paths
app.all("*"),
  (req, res, next) => {
    
    next(new ExpressError("Page not found", 404));

  };

//custom error handler to replace the default
app.use((err, req, res, next) => {
  //set defailt status code/message
  const {
    statusCode = 500
  } = err;
  //if no error, set default
  if (!err.message) err.message = "Something went wrong!";
  //extract err
  res.status(statusCode).render("error", {
    err
  });
});

const server = app.listen(3000, () => {
  console.log("Serving on port 3000");
});

module.exports = server;
module.exports = app;