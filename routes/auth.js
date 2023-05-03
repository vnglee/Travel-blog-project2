var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

const User = require('../models/User')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { firstName, lastName, userName, email, password } = req.body

//   if (!fullName || !email || !password) {
//         res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
//         return;
//     }

//     //check the password strength
//     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//     if (!regex.test(password)) {
//         res
//             .status(500)
//             .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
//         return;
//     }

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
            res.redirect('/blog/home')
        })
        .catch((error) => {
            console.log(error)
        })

})

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login.hbs')
})

router.post('/login', isLoggedOut, (req, res, next) => {
    const { email, password } = req.body

    User.findOne({email})
    .then(user => {
        if (!user) {
            res.render('auth/login', { errorMessage: 'Incorrect email or password' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.user = user
            console.log('User:', user)
            res.redirect('/blog/home')
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect email or password' });
        }
    })
    .catch(error => next(error));
})

// router.get('/logout', isLoggedIn, (req, res, next) => {
//     res.render('auth/logout.hbs')
// })

router.get('/logout', isLoggedIn, (req, res, next) => {
    if(req.session)
    console.log("logout:", res.session)
    req.session.destroy(err => {
        if (err) next(err)
        res.redirect('/')
    })
})

module.exports = router