const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../models/User");
const {
  uploader,
  cloudinary
} = require("../config/cloudinary.js");
const {
  ensureAuthenticated
} = require('./middlewares');
const Dog = require('../models/Dog');

// EDIT USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/users/:id/edit', (req, res, next) => {
  const id = req.user.id;
  if (id !== req.params.id) res.redirect("/login");
  User.findById(id).populate('dog')
    .then(user => {
      let isWalker = false;
      if (user.type === 'dog-walker') isWalker = true;
      let isOwner = false;
      if (user.type === 'dog-owner') isOwner = true;

      res.render('users/editProfile', {
        user,
        isOwner,
        isWalker
      })
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
  User.findById(req.params.id).populate('dog').then(user => {
    // let dogs = user.dog[0];
    let isSameUser = false;
    if (req.user.id == req.params.id) isSameUser = true;
    let isWalker = false;
    if (user.type === 'dog-walker') isWalker = true;
    let isOwner = false;
    if (user.type === 'dog-owner') isOwner = true;

    res.render("users/profile", {
      user,
      isSameUser,
      isOwner,
      isWalker
    })
  })
})

router.get('/users/:id/requests', (req, res, next) => {
  let walkArr = [];
  let obj = {};
  User.findById(req.user.id).then(user => {
    if (user.type === 'dog-owner') {
      Dog.findOne({
        owner: req.user.id
      }).then(dog =>
        dog.requests.forEach(request => {
          User.findById(request.walkerId).then(walker => {
            obj = {
              walkerId: walker._id,
              walkerName: walker.name,
              userId: req.user.id,
              dogPic: dog.imgPath,
              walkerPic: walker.imgPath,
              status: request.status,
              link: "/users/" + req.user.id + "/requests"
            }
            walkArr.push(obj)
            res.render('users/requestsOwners', {
              walkArr
            })
          })
        })
      )
    } else {
      User.findById(req.user.id).then(user => {
        user.requests.forEach(r => {
          Dog.findOne({
            _id: r.dogId
          }).then(dog => {
            User.findOne({
              _id: dog.owner
            }).then(owner => {
              obj = {
                ownerId: owner._id,
                ownerName: owner.name,
                userId: req.user.id,
                dogPic: dog.imgPath,
                ownerPic: owner.imgPath,
                status: r.status
              }
              walkArr.push(obj)
              res.render('users/requestsWalkers', {
                walkArr,
                owner
              })
            })
          })
        })
      })
    }
  })
})

router.post('/users/requests/:walkerId/:choice', (req, res, next) => {
  let statusChange = "denied";
  let redirect = "/users/" + req.user.id + "/requests";
  let dogId;
  if(req.params.choice === 'confirm') statusChange = "confirmed";
  Dog.update(
    { owner: req.user.id, "requests.walkerId": req.params.walkerId },
    { $set: { "requests.$.status" : statusChange } }
    ).then(dog => dogId = dog._id)
  Dog.findOne({ owner: req.user.id}).then(dog => 
    User.update(
      { _id: req.params.walkerId, "requests.dogId": dog._id },
      { $set: { "requests.$.status" : statusChange } }
      ).then(dog => console.log('done')))
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