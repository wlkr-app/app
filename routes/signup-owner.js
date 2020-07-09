const express = require("express");
const router = express.Router();
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");
const User = require("../models/User");
const Dog = require("../models/Dog");



// OWNER SIGNUP [first page] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/ownersignup", (req, res, next) => {
  // console.log(req.session)
  // console.log(req.user)

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


// router.get("/ownersignup", (req, res, next) => {
//   // console.log(req.session)
//   // console.log(req.user)
//   console.log('heeee');

//   axios.get('https://api.thedogapi.com/v1/breeds').then(plz => // find a plz api :(
//       User.findById(req.user.id)
//       .then(user => {
//         console.log('dataaaaaaaa' + plz.data)
//         res.render('auth/owner-signup-info', {
//           user,
//           plz: plz.data
//         })
//       }))
//     .catch(error => {
//       console.log('Error: ', error);
//       next();
//     });

// });





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
        address: {
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



// OWNER SIGNUP [second page] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/ownersignup-dog", (req, res, next) => {
  const id = req.user.id;
  axios.get('https://api.thedogapi.com/v1/breeds')
    .then(response => {
      const list = response.data;
      User.findById(id)
        .then(user => {
          res.render("auth/owner-signup-dog", {
            user,
            list
          })
        })
    })
  // console.log(req.user)
});

router.post("/ownersignup-dog", uploader.single("photo"), (req, res, next) => {
  // console.log(req.file);
  const {
    name,
    age,
    gender,
    breed,
    description,
    timeslots
  } = req.body;
  const owner = req.user._id;
  const street = req.user.address.street;
  const city = req.user.address.city;
  const zip = req.user.address.zip;
  const houseNumber = req.user.address.houseNumber;


  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const imgPublicId = req.file.public_id;

  // if statements for the form completion

  Dog.create({
      name,
      age,
      gender,
      breed,
      description,
      timeslots,
      owner,
      address: {
        street,
        city,
        zip,
        houseNumber
      },
      imgPath,
      imgName,
      imgPublicId
    })
    .then(dog => {
      User.update({
          _id: owner
        }, {
          $set: {
            dog: dog._id
          }
        }, {
          new: true
        })
        .then(() => {
          res.redirect("/ownersignup-done");
        })
        .catch((error) => {
          res.render('/users/:id/edit');
          console.log(error);
        })
    })
    .catch(error => {
      console.log(error);
    })
});



// OWNER SIGNUP [third page] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get("/ownersignup-done", (req, res, next) => {
  // console.log(req.user)
  const id = req.user.id;
  User.findById(id).populate('dog')
    .then(user => {
      res.render("users/profile", {user}) 
    })

    .catch(error => {
      console.log('Error: ', error);
      next();
    });
});


module.exports = router;