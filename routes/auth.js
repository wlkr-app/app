const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");

const User = require("../models/user");
const Dog = require("../models/dog");


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect('/login')
//   }
// }



// SIGNUP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
    type
  } = req.body;

  if (username == '' || password == '') {
    res.render('auth/signup', {
      errorMessage: 'Please fill up both fields.'
    });
    return;
  }
  if (password.length < 8) {
    res.render('auth/signup', {
      errorMessage: 'Your password has to be at least 8 characters long.'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists."
        });
        return;
      }
    })
    .catch(error => {
      console.log(error);
    });

  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
      username,
      password: hashPass,
      type
    })
    .then(() => { // redirect to signup for owners or for walkers
      passport.authenticate('local')(req, res, function () {
        res.redirect("/ownersignup");
      })
    })
    .catch(error => {
      console.log(error);
    })

});


// LOGIN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/login", (req, res, next) => {
  // if (!req.session.user) {
  //     res.render('auth/signup', { errorMessage: 'You must login first.' });
  // } else {
  res.render("auth/login", {
    "errorMessage": req.flash("error")
  })
  .catch(error => {
    console.log(error);
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dogs/cards",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));



// LOGOUT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;