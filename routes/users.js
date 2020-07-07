const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../models/User");
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect('/login')
//   }
// }



// EDIT USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/users/:id/edit', (req, res, next) => {
  // console.log('body' + req.body)
  // console.log('user' + req.user)

  const id = req.user.id;
  User.findById(id)
    .then(user => {
      // console.log('user is' + user)

      res.render('users/profile', user)
    })

    .catch(error => {
      console.log('Error: ', error);
      next();
    });
})

router.post('/users/:id/edit', uploader.single("photo"), (req, res, next) => {
  console.log(req.body)
  console.log(req.user)
  const id = req.user.id;

  const {
    name,
    street,
    houseNumber,
    zip,
    city
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
      res.redirect('/users/:id/edit');
    })
    .catch((error) => {
      res.render('/users/:id/edit');
      console.log(error);
    })
});





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