const express = require('express');
const router = express.Router();
const User = require("../models/User");


router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user
  });
});

router.get('/home', (req, res, next) => {
  User.findById(req.user._id).then(dbUser => {
    if (dbUser.type === 'dog-owner') res.redirect('/users/:id/requests'); ////// TDB!!!!!!!!!!
    else res.redirect('/dogs/cards/');
  })
});




module.exports = router;