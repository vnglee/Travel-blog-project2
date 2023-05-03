var express = require('express');
var router = express.Router();

const User = require('../models/User')
// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.js');

const { isLoggedIn} = require('../middleware/route-guard')

router.get('/profile', isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {

  User.findOne(req.session.user)
  .then((user) => {
    console.log('user:', user)
    res.render('profile/profile.hbs', {user});
  })
  .catch((error) => {
    console.log(error)
  })
});

module.exports = router;
