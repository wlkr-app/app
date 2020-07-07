const express = require("express");
const router = express.Router();
const axios = require('axios');
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");

const Dog = require("../models/Dog");
const User = require("../models/User");
const { ensureAuthenticated } = require('./middlewares');

// EDIT DOGS
router.get('/dogs/:id/edit', ensureAuthenticated(), (req, res, next) => {
  axios.get('https://api.thedogapi.com/v1/breeds').then(breeds =>
  Dog.findById(req.params.id)
    .then(dog => {
      res.render('dogs/editProfile', { dog, breeds: breeds.data })
    })
    .catch(error => {
      console.log('Error: ', error);
      next();
    }));
})

router.post('/dogs/:id/edit', uploader.single("photo"), (req, res, next) => {
  const {
    name,
    breed,
    age,
    gender,
    description,
    timeslots
  } = req.body;

  let imgPath;
  let imgName;
  let imgPublicId;

  if (req.file == true) {
     imgPath = req.file.url;
     imgName = req.file.originalname;
     imgPublicId = req.file.public_id;
  } else {
     imgPath = req.user.imgPath;
     imgName = req.user.imgName;
     imgPublicId = req.user.imgPublicId;
  }

  Dog.update({
      _id: req.params.id
    }, {
      $set: {
        name,
        breed,
        age,
        gender,
        description,
        timeslots,
        imgPath,
        imgName,
        imgPublicId
      }
    }, {
      new: true
    })
    .then(() => {
      res.redirect('/dogs/:id/edit');
    })
    .catch((error) => {
      res.render('/dogs/:id/edit');
      console.log(error);
    })
});

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
  let userId = req.user.id;
  axios.get('https://api.thedogapi.com/v1/breeds')
    .then(response => {
      // console.log(response.data);
      const list = response.data;
      res.render('dogs/add', {
        list, userId
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

router.get('/dogs/delete/:id', ensureAuthenticated(), (req, res, next) => {
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
  let userId = req.user.id;
  Dog.findById(req.params.id).then(dog => {
    res.render("dogs/profile", { dog, userId })
  })
})

// router.get('/dogs/requested', (req, res, next) => {
//   res.send('booked')
// });


// add the walker that can be seen by the owner of the dog
router.post('/dogs/:id', (req, res, next) => {
  Dog.findOneAndUpdate(
    { _id: req.params.id }, 
    { $push: { walkers: req.user.id } }
  ).then(dog => {
      User.findOneAndUpdate(
        { _id: req.user.id }, 
        { $push: { dogsToWalk: req.params.id } }
      ).then(user => {
        res.redirect("/dogs/cards")
      })
  })
})


module.exports = router;