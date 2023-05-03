const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login')
    }
    next()
}

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/auth/loggedout')
    }
    next()
}

module.exports = { isLoggedIn, isLoggedOut }