const User = require("../models/User");

const ensureAuthenticated = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

module.exports = {
  ensureAuthenticated
};