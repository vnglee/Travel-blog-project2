var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose')

// const User = require('../models/User')
const Blog = require('../models/Blog')

router.get('/add', (req, res, next) => {
    res.render('blog/add.hbs')
})

router.post('/add', (req, res, next) => {
    const { title, post } = req.body

    Blog.create({
        title,
        // date,
        // author: req.session.user._id,
        post
    })
    .then((createdBlog) => {
        console.log('New blog:', createdBlog)
        // res.redirect(`/blog/add/${createdBlog._id}`)
        res.redirect('/blog/blog-home')
    })
    .catch((error) => {
        console.log(error)
    })
})

router.get('/blog-home', (req, res, next) => {
    Blog.find()
    .then((blogs) => {
        res.render('blog/blog-home.hbs', {blogs})
    })
    .catch((error) => {
        console.log(error)
    })
})



module.exports = router;
