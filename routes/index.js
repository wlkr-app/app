const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/', (req, res, next) => {
  axios.get('https://api.thedogapi.com/v1/breeds')
    .then(response => {
      // console.log(response.data);
      const list = response.data;
      res.render('index', {
        list
      });
    })
    .catch(err => {
      console.log(err);
    })
});





module.exports = router;