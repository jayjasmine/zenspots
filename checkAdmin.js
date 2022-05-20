const isAdmin = (req, res, next) => {
    if (req.user.usertype !== 'admin') {
        res.status(401, 'Unauthorized')
    }   
    next();
  };
  
  
  module.exports = isAdmin;