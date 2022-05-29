//Admin check middleware
//This function is to be used on all Admin routes. It checks if the user is an admin.
//If the user is not an admin, the user is redirected, otherwise it moves on to the next function.

const isAdmin = (req, res, next) => {
    if (req.user.usertype !== 'admin') {
        req.flash("error", "You are not authorized to view this page");
        // res.status(401, 'Unauthorized')
        return res.redirect("zenspots");
    }   
    next();
  };
  
  
  module.exports = isAdmin;