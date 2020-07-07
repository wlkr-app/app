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

// SIGNUP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
          password: hash,
          type: type
        })
        .then(dbUser => {
          req.login(dbUser, err => {
            if (err) next(err);
            if (dbUser.type === 'dog-owner') res.redirect('/ownersignup');
            else res.redirect('/walkersignup');
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
  res.render("auth/login", {
    "errorMessage": req.flash("error")
  })

});


// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/dogs/cards',
//     failureRedirect: '/login',
//     failureFlash: true,
//     passReqToCallback: true
//   })
// )


// app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });


router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    req.session.currentUser = user;
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        console.log("ERR")
        return next(err);
      }
      if (user.type === 'dog-walker') {
        console.log("HERE", user);
        res.redirect('/dogs/cards/')
      }
      if (user.type === 'dog-owner') {
        console.log("HERE2", user);

        res.redirect('/')
      }
    });
  })(req, res, next);
});






// LOGOUT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;