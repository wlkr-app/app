const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../models/User");
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");
const { ensureAuthenticated } = require('./middlewares');

// EDIT USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/users/:id/edit', (req, res, next) => {
  const id = req.user.id;
  if(id !== req.params.id) res.redirect("/login");
  User.findById(id).populate('dog')
    .then(user => {
      let addressShow = true;
      if(user.type === 'dog-walker') addressShow = false;
      // console.log('user is' + req.user);
      // console.log('user is' + user)
      res.render('users/editProfile', {user, addressShow})
    })
    .catch(error => {
      console.log('Error: ', error);
      next();
    });
})

router.post('/users/:id/edit', uploader.single("photo"), (req, res, next) => {
  const id = req.user.id;
  // console.log('file' + req.file.url);
  console.log('user' + req.user);

  const {
    name,
    street,
    houseNumber,
    zip,
    city,
    description
  } = req.body;


  let imgPath = req.user.imgPath;
  let imgName = req.user.imgName;
  let imgPublicId = req.user.imgPublicId;

  if (req.file) {
     imgPath = req.file.url;
     imgName = req.file.originalname;
     imgPublicId = req.file.public_id;
  } 

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
        description,
        imgPath,
        imgName,
        imgPublicId
      }
    }, {
      new: true
    })
    .then((user) => {
      res.redirect('/users/' + req.user.id);
    })
    .catch((error) => {
      res.render('/users/' + req.user.id + '/edit');
      console.log(error);
    })
});

router.get('/users/:id', (req, res, next) => {
  User.findById(req.user.id).populate('dog').then(user => {
    // let dogs = user.dog[0];
    let addressShow = true;
    if(user.type === 'dog-walker') addressShow = false;
    res.render("users/profile", { user, addressShow })
  })
})


// router.get('/dash', ensureAuthenticated(), (req, res, next) => {

//   Dog.findById(id)
  
  
  
  
//   Dog.find().then(allDogs => {
//     const id = req.user.id;
//     User.findById(id)
//       .then(user => {
//         res.render('dogs/cards', {
//           dogs: allDogs,
//           user: req.user
//         })
//       })
//   })
// });





// router.post('/users/:id/edit', (req, res, next) => {
//   console.log('reqbody is' + req.body.name)

//   const id = req.user.id;
//   const {
//     name,
//     street,
//     houseNumber,
//     zip,
//     city
//   } = req.body;

//   let imgPath;
//   let imgName;
//   let imgPublicId;

//   if (!imgPath || !imgName || imgPublicId) {
//     imgPath = req.user.imgPath;
//     imgName = req.user.imgName;
//     imgPublicId = req.user.imgPublicId;
//   } else {imgPath = req.file.url;
//     imgName = req.file.originalname;
//     imgPublicId = req.file.public_id;}

// console.log(req.user)

//   User.update({
//       _id: id
//     }, {
//       $set: {
//         name,
//         street,
//         houseNumber,
//         zip,
//         city,
//         imgPath,
//         imgName,
//         imgPublicId
//       }
//     }, {
//       new: true
//     })
//     .then(() => {
//       res.redirect('/users/:id/edit');
//     })
//     .catch((error) => {
//       res.render('/users/:id/edit');
//       console.log(error);
//     })
// });

module.exports = router;