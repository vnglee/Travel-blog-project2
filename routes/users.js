var express = require('express');
var router = express.Router();

const User = require('../models/User')
// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.js');

const { isLoggedIn} = require('../middleware/route-guard')

router.get('/profile', isLoggedIn, (req, res, next) => {

  User.findById(req.session.user._id)
  .then((user) => {
    console.log('user:', user)
    res.render('profile/profile.hbs', {user});
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/profile', isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {

  console.log('this is the existing image: ', req.session.user.imageUrl)

  console.log(req.file)
  let existingImage = req.session.user.imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  } else {
    imageUrl = existingImage;
  }
 
  User.findByIdAndUpdate(req.session.user._id, { imageUrl }, { new: true })
    .then((foundUser) => {
      req.session.user = foundUser
      console.log(foundUser)
    res.redirect('/users/profile')
  })
    .catch(error => console.log(`Error while updating a single movie: ${error}`))

});


module.exports = router;
