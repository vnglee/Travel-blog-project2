var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose')

// const User = require('../models/User')
const Blog = require('../models/Blog')

router.get('/add', (req, res, next) => {
    res.render('blog/add.hbs')
})

router.post('/add', (req, res, next) => {
    const { title, author, post } = req.body

    Blog.create({
        title,
        // date,
        author: req.session.user._id,
        post
    })
    .then((createdBlog) => {
        console.log('New blog:', createdBlog)
        // res.redirect(`/blog/add/${createdBlog._id}`)
        res.redirect('/blog/home')
    })
    .catch((error) => {
        console.log(error)
    })
})

router.get('/home', (req, res, next) => {
    Blog.find()
    .then((blogs) => {
        res.render('blog/blog-home.hbs', {blogs})
    })
    .catch((error) => {
        console.log(error)
    })
})

router.get('/entry/:id', (req, res, next) => {
    const {id} = req.params
    Blog.findById(id)
        .populate('author')
        .then((entry) => {
        console.log('entry:', entry)
        res.render('blog/blog-entry.hbs', entry)
    })
    .catch((error) => {
        console.log(error)
    })
})

router.get('/delete/:id', (req, res, next) => {
    const {id} = req.params

    Blog.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/blog/home')
        })
        .catch((error) => {
            console.log(error)
        })
})

router.get('/edit/:id', (req, res, next) => {
    const {id} = req.params

    Blog.findById(id)
        .then((blog) => {
        res.render('blog/edit.hbs', blog)
    })
    .catch((error) => {
        console.log(error)
    })
})

router.post('/edit/:id', (req, res, next) => {
    const {id} = req.params
    const {title, date, author, post} = req.body

    Blog.findByIdAndUpdate(id, req.body, {new: true})
        .then((blog) => {
            res.redirect(`/blog/entry/${id}`)
        })
        .catch((error) => {
            console.log(error)
        })
})

module.exports = router;
