const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");

const User = require("../models/User");
const Dog = require("../models/Dog");


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
    type,
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
      message: 'Your password has to be at least 8 characters long.'
    });
    return;
  }

  User.findOne({
    username: username
  }).then(found => {
    if (found !== null) {
      res.render('auth/login', {
        errorMessage: 'Account already exists'
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({
          username: username,
          password: hash
        })
        .then(dbUser => {
          req.login(dbUser, err => {
            if (err) next(err);
            else res.redirect('/ownersignup');
          });
          res.redirect('login');
        })
        .catch(err => {
          next(err);
        });
    }
  });
})


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


router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dogs/cards',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
)



// LOGOUT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;