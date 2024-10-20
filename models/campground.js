const mongoose = require('mongoose')
const Review = require('./review.js')
const User = require('./user.js')
const Schema =mongoose.Schema


const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
)

// we dont want to store the transformed image from cloudinary in our db so we are just making a virtual fn 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload/', '/upload/w_200/')
})

// by default mongoose does not include virtuals when you convert your document to JSON (which we are doing in case of maptiler) 
// so to include virtuals in JSON we need to do this and paas it in our schema
const opts = {toJSON : {virtuals:true}}

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        } , 
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    } ,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
} , opts)

// for cluster map , maptiler expects properties value from us for the popup text to be shown so adding a virtual property for that 
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})



// mongoose post middleware to delete all reviews related to  a particular campground when we delete that campground 
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({_id:{$in:doc.reviews}})
    }
})



const Campground = mongoose.model('Campground',CampgroundSchema)

module.exports = Campground
