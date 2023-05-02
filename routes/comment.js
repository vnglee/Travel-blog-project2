var express = require('express');
var router = express.Router();

const Comment = require('../models/Comment')
const Blog = require('../models/Blog')

const {isLoggedIn} = require('../middleware/route-guard')

router.post('/add-comment/:id', isLoggedIn, (req, res, next) => {

    Comment.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newComment) => {
        console.log('new comment', newComment)
        return Blog.findByIdAndUpdate(req.params.id, 
        {
            $push: {comments: newComment._id}
        },
            {new: true}
       )
    })
    .then((updatedPost) => {
        console.log('updated post', updatedPost)
        res.redirect(`/blog/entry/${updatedPost._id}`)
    })
    .catch((error) => {
        console.log(error)
    })

})

module.exports = router;
