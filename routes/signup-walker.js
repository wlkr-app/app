const express = require("express");
const router = express.Router();
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");
const User = require("../models/User");
const Dog = require("../models/Dog");



// WALKER SIGNUP [first page] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/walkersignup", (req, res, next) => {
  // console.log(req.session)
  // console.log(req.user)

  const id = req.user.id;
  User.findById(id)
    .then(user => {
      res.render('auth/walker-signup-info', user)
    })
    .catch(error => {
      console.log('Error: ', error);
      next();
    });

});

router.post('/walkersignup/:id', uploader.single("photo"), (req, res, next) => {
  const id = req.user.id;
  const {
    name, // address is not working, doesn't register on database
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
      res.redirect('/walkersignup-done');
    })
    .catch((error) => {
      res.render('/');
      console.log(error);
    })
});


// WALKER SIGNUP [second page] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/walkersignup-done", (req, res, next) => {
  console.log(req.user)
  const id = req.user.id;
  User.findById(id)
  .then(user => {
    res.render("auth/walker-signup-done", user)
  })

  .catch(error => {
    console.log('Error: ', error);
    next();
  });
});


module.exports = router;