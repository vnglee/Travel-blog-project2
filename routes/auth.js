var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

const User = require('../models/User')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res, next) => {
    const { firstName, lastName, userName, email, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword
            })
        })
        .then(createdUser => {
            console.log('New user:', createdUser)
            res.redirect('/')
        })
        .catch((error) => {
            console.log(error)
        })

})

router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs')
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body

    User.findOne({email})
    .then(user => {
        if (!user) {
            res.render('auth/login', { errorMessage: 'Incorrect email or password' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.user = user
            console.log('User:', user)
            res.redirect('/blog/blog-home')
            // res.redirect(`/users/profile`);
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect email or password' });
        }
    })
    .catch(error => next(error));
})

router.get('/loggedout', (req, res, next) => {
    res.render('auth/loggedout.hbs')
})

router.get('/logout', (req, res, next) => {
    if(req.session)
    req.session.destroy(err => {
        if (err) next(err)
        res.redirect('/auth/loggedout')
    })
})

module.exports = router