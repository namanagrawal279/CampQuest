const express = require('express')
const router = express.Router({mergeParams:true})

const catchAsync = require('../utils/catchAsync.js')
const Campground = require("../models/campground.js");
const Review = require('../models/review.js')

const reviews = require('../controllers/reviews.js')

const {validateReview} = require('../middleware.js')
const {isLoggedIn} = require('../middleware.js')
const {isReviewAuthor} = require('../middleware.js')




// jo apna review h uska path kya hoga 
// POST : /campgrounds/:id/reviews 
// ye islie hoga bcs wo review koi ek particular campground se link hoga 

router.post("/", isLoggedIn , validateReview ,catchAsync(reviews.createReview))

// to delete a review 
router.delete("/:reviewId", isLoggedIn , isReviewAuthor ,catchAsync(reviews.deleteReview))

module.exports = router;