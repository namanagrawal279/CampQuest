const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user.js')
const passport = require('passport')
const {storeReturnTo} = require('../middleware.js')
const users = require('../controllers/users.js')

// register routes 
// GET /register - render a form
// POST /register - create a user

router.get('/register',users.renderRegister)

router.post('/register', catchAsync(users.register))

// login routes
// GET /login - render a form
// POST /login - authenticate user

router.get('/login',users.renderLogin) 

// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// passport.authenticate logs the user in and clears req.session
router.post('/login', storeReturnTo , passport.authenticate('local',{failureFlash:true , failureRedirect:'/login'}), users.login)


// logout route 
router.get('/logout', users.logout); 

module.exports = router