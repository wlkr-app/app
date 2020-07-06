const express = require("express");
const router = express.Router();

const passport = require("passport");

const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


const User = require("../models/user");



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

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

router.get("/ownersignup", (req, res, next) => {
  console.log(req.session)
  console.log(req.user)

  const id = req.user.id;
  User.findById(id)
    .then(user => {
      res.render('auth/owner-signup-info', user)
    })
    .catch(error => {
      console.log('Error: ', error);
      next();
    });

});

router.post('/ownersignup/:id', uploader.single("photo"), (req, res, next) => {
  const id = req.user.id;
  const {
    name,
    street,
    houseNumber,
    zip,
    city
  } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const imgPublicId = req.file.public_id;
  User.update({
      _id: id
    }, {
      $set: {
        name,
        adress: {
          street,
          houseNumber,
          zip,
          city
        },
        imgPath,
        imgName,
        imgPublicId
      }
    }, {
      new: true
    })
    .then(() => {
      res.redirect('/ownersignup-dog');
    })
    .catch((error) => {
      res.render('/');
      console.log(error);
    })
});


router.get("/ownersignup-dog", (req, res, next) => {
  console.log(req.user)
  const id = req.user.id;
  User.findById(id)
    .then(user => {
      res.render("auth/owner-signup-dog", user)
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