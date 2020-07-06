const express = require('express');
const router = express.Router();

const User = require("../models/user");


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}



// EDIT USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/users/:id/edit', ensureAuthenticated, (req, res, next) => {
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

router.post('/users/:id/edit', (req, res, next) => {
  const id = req.user.id;
  const {
    name,
    district,
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
        district,
        city,
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







module.exports = router;