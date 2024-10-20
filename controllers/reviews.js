const Campground = require("../models/campground.js");
const Review = require('../models/review.js')



module.exports.createReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    // adding author for a particular review (we can reach this step only when the user is logged in bcs of our middleware)
    review.author = req.user._id;

    campground.reviews.push(review);
    await review.save();
    await campground.save();

     // we want to flash a message just after creating a review 
     req.flash('success','Created new review')
    
     // after the flash message , we redirect 
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res)=>{
    const {id,reviewId} = req.params;
  
    // $pull Operator: This MongoDB operator removes the reviewId from the reviews array in the Campground document. 
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    await Review.findByIdAndDelete(reviewId);

    // we want to flash a message just after deleting a review 
    req.flash('success','Deleted a review')
    
    // after the flash message , we redirect 
    res.redirect(`/campgrounds/${id}`);
}