const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    type,
    username,
    password
  } = req.body;

  if (username == '' || password == '') {
    res.render('auth/signup', {
      message: 'Please fill up both fields.'
    });
    return;
  }
  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password has to be at least 8 characters long.'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          message: "The username already exists"
        });
        return;
      }
    });
  
  const salt = bcrypt.genSaltSync();
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
      type,
      username,
      password: hashPass,
      salt
    })
    .then((user) => { 
      req.login(user, err => {
        if (err) next(err);
        else res.redirect('/dogs/cards');
      });
      res.redirect('/login')
    })
    .catch(error => {
      console.log(error);
    })

});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash('Invalid credentials.')});
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dogs/cards',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;