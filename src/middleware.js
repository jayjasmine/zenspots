const isLoggedIn = (req, res, next) => {
  // console.log("req.user...", req.user);
  //check if user is logged in, if not, save current url, flash error and redirect to login page
  if (!req.isAuthenticated()) {
    //save original url so we can redirect user to that url after logging in
    req.session.returnUrl = req.originalUrl;
    //flash error that they need to be logged in
    req.flash("error", "You need to be logged into view that page");
    return res.redirect("/login");
  }
  next();
};


module.exports = isLoggedIn;