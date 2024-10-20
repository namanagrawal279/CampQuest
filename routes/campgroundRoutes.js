const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync.js')
const Campground = require("../models/campground.js");

const {isLoggedIn} = require('../middleware.js')
const {validateCampground} = require('../middleware.js')
const {isAuthor} = require('../middleware.js')

const campgrounds = require('../controllers/campgrounds.js')

// setting up malter middleware which is used to parse multipart forms which are used to handle file uploads
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage}) 





// this to show all campgrounds
router.get("/", catchAsync(campgrounds.index));
  
  
// form to add new one
router.get("/new",isLoggedIn, campgrounds.renderNewForm);
  

// adding the new campground
router.post("/", isLoggedIn , upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground));

  
// finding a particular campground based on id
router.get("/:id", catchAsync(campgrounds.showCampground));
  

// editing form
router.get("/:id/edit", isLoggedIn , isAuthor, catchAsync(campgrounds.renderEditForm));
  

// applying the edited data
router.put("/:id",isLoggedIn, isAuthor , upload.array('image') , validateCampground, catchAsync(campgrounds.updateCampground));
  

// deleting the campground
router.delete("/:id",isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
  

module.exports = router;