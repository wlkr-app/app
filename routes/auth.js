const express = require("express");
const router = express.Router();

const passport = require("passport");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


const User = require("../models/user");


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (username == '' || password == '') {
    res.render('auth/signup', {
      errorMessage: 'Please fill up both fileds.'
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
          message: "The username already exists"
        });
        return;
      }
    });

  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
      username,
      password: hashPass
    })
    .then(() => { 
      res.redirect("dogs/cards");
    })
    .catch(error => {
      console.log(error);
    })

});


router.get("/login", (req, res, next) => {
  // if (!req.session.user) {
  //     res.render('auth/signup', { errorMessage: 'You must login first.' });
  // } else {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dogs/cards",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;