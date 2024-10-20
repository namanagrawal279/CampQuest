const Campground = require("../models/campground.js");
const {cloudinary} = require('../cloudinary')

// setting maptiler 
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
}

module.exports.createCampground = async (req, res, next) => {
    // mtlb agar form mei kuch provide nhi hua tb ye run krna h (basically this is a server side valdation) 
    // if(!req.body.campground) throw new ExpressError('invalid campground data',400)

    // adding forward geocoding 
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1})

    const newCampground = new Campground(req.body.campground);

    newCampground.geometry = geoData.features[0].geometry;

    // using req.files for images 
    newCampground.images = req.files.map(f => ({url : f.path , filename : f.filename}))

    // saving the author of that user who have created a campground (req.user will have the user info bcs he can reach this step only after he is logged in)
    newCampground.author = req.user._id;

    await newCampground.save();

    // we want to flash a message just after creating a new campground 
    req.flash('success','Successfully created a new campground')
    
    // after the flash message , we redirect 
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;

    // ye jo populate wla scene hai ye mongo relations ka h
    // to pehle to campground ke andar reviews aur campground ke authors ko populate kra 
    // lekin har review ka jo author h usko bhi to populate krenge so its basically a nested populate 
    const campground = await Campground.findById(id).populate({
       path : 'reviews' ,
       populate : {
        path : 'author'
       }
    }).populate('author'); 


    // maanlo campground mila hi ni uss id se kisi reason ki wajah se to error ka message flash krdenge 
    if (!campground) {
        req.flash('error', 'Campground not found');
        // also agar flash kra h error ka to redirect bhi krenge (redirect islie krenge kyunki error agyi to page break hojaega to redirect krke jaha pahunchana h wha pahuncha denge)
        return res.redirect('/campgrounds');
    }

    // agar milgya campground tb to ye run ho hi jaega
    res.render("campgrounds/show.ejs", { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    // maanlo campground mila hi ni uss id se kisi reason ki wajah se to error ka message flash krdenge 
    if (!campground) {
        req.flash('error', 'Campground not found');
        // also agar flash kra h error ka to redirect bhi krenge (redirect islie krenge kyunki error agyi to page break hojaega to redirect krke jaha pahunchana h wha pahuncha denge)
        return res.redirect('/campgrounds');
    }

    // agar milgya campground tb to ye run ho hi jaega
    res.render("campgrounds/edit.ejs", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, {  ...req.body.campground});

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;

    const imgs = req.files.map(f => ({url : f.path , filename : f.filename}))
    campground.images.push(...imgs);
    await campground.save();

    if(req.body.deleteImages){
        // deleting the images from cloudinary 
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        // deleting the images from mongo
        await campground.updateOne({$pull : {images :{filename : {$in : req.body.deleteImages}}}})
    }

    // we want to flash a message just after updating a new campground 
    req.flash('success','Successfully updated a new campground')
    
    // after the flash message , we redirect 
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

     // we want to flash a message just after updating a new campground 
     req.flash('success','Successfully deleted a campground')
    
     // after the flash message , we redirect 
    res.redirect("/campgrounds");
}