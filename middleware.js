const ExpressError = require('./utils/ExpressError.js')
const {campgroundSchema} = require('./schemas.js')
const {reviewSchema} = require('./schemas.js')
const Campground = require("./models/campground.js");
const Review = require("./models/review.js");



// this is for server side validation for campgrounds(joi)
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// this middleware uses passport's req.isAuthenticated() method to check if user is signed in and can be used to protect routes
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){

        // saving the original url inside session before redirecting them to login page 
        req.session.returnTo = req.originalUrl;

        req.flash('error','You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

// saving the returnTo inside of res.locals bcs session is cleared after login so we wont have access to returnTo inside of session after login 
module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

// ye middleware uske lie h ki jisne login kra h kya whi user campground ka author hai (agar hai to hi apan permission denge usse campground se chedkaani krne ki) 
module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);

    // campground dhundne ke baad we will check ki jo login kr ra wo author to h na 
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}


// this is for server side validation for reviews(joi)
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// to check if the person deleting the review is the author or not 
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id , reviewId} = req.params
    const review = await Review.findById(reviewId);

    // campground dhundne ke baad we will check ki jo login kr ra wo author to h na 
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}