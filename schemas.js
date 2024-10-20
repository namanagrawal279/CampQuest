// this is for server side validation (client side to krdi bootstrap se lekin postman se abhi bhi koi request bhej skta h to server side validation is also required)
const Joi = require('joi');

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages : Joi.array()
});


// jo form mei review wla data jo tha uske name apan ne die the review[body] and review[rating] 
// to wo data jb apne paas aega to wo aise aega 

// review:{
//     body:xyz,
//     rating:2
// }

// to data jo hoga wo aisa hoga ki review naam ka ek object hoga aur uske andar body and rating honge 

const reviewSchema = Joi.object({
    review:Joi.object({
        body:Joi.string().required(), 
        rating:Joi.number().required().min(1).max(5)
    }).required()
})



module.exports = { campgroundSchema, reviewSchema };
