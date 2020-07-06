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
      res.redirect("/dogs/cards");
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

// router.post("/login", (req, res, next) => {
//   const {
//     username,
//     password
//   } = req.body;

//   if (username === "" || password === "") {
//     res.render("auth/login", {
//       errorMessage: "Please enter both username and password."
//     });
//     return;
//   }

//   User.findOne({
//       username: username
//     })
//     .then(user => {
//       if (!user) {
//         res.render("auth/login", {
//           errorMessage: "The username doesn't exist."
//         });
//         return;
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         req.session.user = user; // this grabs the login information and stores it. but why?
//         // console.log(req.session.user)
//         res.redirect("/dogs/cards");
//       } else {
//         res.render("auth/login", {
//           errorMessage: "Incorrect password."
//         });
//       }
//     })
//     .catch(error => {
//       next(error);
//     })
// });

// router.get('/logout', (req, res, next) => {
//   req.session.destroy(err => {
//     if (err) {
//       next(err);
//     } else {
//       res.redirect('/');
//     }
//   })
// });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;