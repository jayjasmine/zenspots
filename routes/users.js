const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../helpers/catchAsync");
const passport = require("passport");
const isLoggedIn = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  //Execute catchAsync function to catch errors and send to error handler
  catchAsync(async (req, res) => {
    try {
      //Destructure(pull out) email, user, name out of the request body
      const {
        email,
        username,
        password
      } = req.body;
      //create new user with email and username from req body
      const user = new User({
        email,
        username,
        usertype: 'user'
      });
      //use passport-local-mongoose function .register() to create new user with user data from req.body and create hashed and salted password
      const registeredUser = await User.register(user, password);
      //use passport-local-mongoose login() to pass in callback with error parameter, if there is an error move to error handler
      req.login(registeredUser, (err) => {
        if (err) return next(err);
      });
      req.flash("success", "Welcome to Zen Spots!");
      res.redirect("/zenspots");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

//use passport to authenticate user with local stategy. On failure, flash message and redirect to login page
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Zen Spots!");
    //save returnUrl into previous url, if none set to /zenspots
    const previousUrl = req.session.returnUrl || '/zenspots'
    //delete return url from session data
    delete req.session.returnUrl;
    //redirect to previous url after log in
    res.redirect(previousUrl);
  }
);

//Account settings page
router.get("/myaccount",
  //Check if logged in
  isLoggedIn, (req, res) => {
    res.render("users/myaccount");
  });

//Log out route
router.get("/logout", (req, res) => {
  //use passport function logout() to destroy session
  req.logout();
  req.flash("success", "You have been logged out");
  res.redirect("zenspots");
});

module.exports = router;