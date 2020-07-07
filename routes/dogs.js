const express = require("express");
const router = express.Router();
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");

const Dog = require("../models/Dog");
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



// DOG CARDS VIEW - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/dogs/cards', ensureAuthenticated(), (req, res, next) => {
  Dog.find().then(allDogs => {
    const id = req.user.id;
    User.findById(id)
      .then(user => {
        res.render('dogs/cards', {
          dogs: allDogs,
          user: req.user
        })
      })
  })
});



// ADD DOG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/dogs/add', ensureAuthenticated(), (req, res, next) => {
  axios.get('https://api.thedogapi.com/v1/breeds')
    .then(response => {
      // console.log(response.data);
      const list = response.data;
      res.render('dogs/add', {
        list
      });
    })
    .catch(err => {
      console.log(err);
    })
});

router.post("/dogs/add", ensureAuthenticated(), uploader.single("photo"), (req, res, next) => {
  // console.log(req.file);
  const {
    name,
    age,
    gender,
    breed,
    description
  } = req.body;
  const owner = req.user._id;
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
      owner,
      imgPath,
      imgName,
      imgPublicId
    })
    .then(() => {
      res.redirect("/dogs/cards");
    })
    .catch(error => {
      console.log(error);
    })

});



// DELETE DOG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/dogs/delete/:id', (req, res, next) => {
  Dog.findByIdAndDelete(req.params.id)
    .then(dog => {
      // if movie has an image then we also want to delete the img on cloudinary
      if (dog.imgPath) {
        // delete the img on cloudinary - we need the so called public id
        cloudinary.uploader.destroy(dog.imgPublicId);
      }
      res.redirect('/dogs/cards');
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/dogs/:id', (req, res, next) => {
  let a = req.user.id;
  Dog.findById(req.params.id).then(dog => {
    res.render("dogs/profile", { dog ,a })
  })
})

// router.get('/dogs/requested', (req, res, next) => {
//   res.send('booked')
// });

router.post('/dogs/:id', (req, res, next) => {
  Dog.findOneAndUpdate(
    { _id: req.params.id }, 
    { $push: { walkers: req.user.id } }
  ).then(dog => {
      User.findOneAndUpdate(
        { _id: req.user.id }, 
        { $push: { walkers: req.params.id } }
      ).then(user => {
        res.redirect("/dogs/cards")
      })
  })
})


module.exports = router;