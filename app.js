if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')


const User = require('./models/user.js')


const ExpressError = require('./utils/ExpressError.js')

const campgroundRoutes = require('./routes/campgroundRoutes.js')
const reviewRoutes = require('./routes/reviewRoutes.js')
const userRoutes = require('./routes/userRoutes.js')


// const dbUrl = process.env.DB_URL ;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/camp-quest" ; 
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// to serve our static assets inside the public directory 
app.use(express.static(path.join(__dirname, "public")));

// sanitize user inputs to prevent mongo injections 
app.use(mongoSanitize())


const secret = process.env.SECRET || 'secret' ;
// setting up a store for our session in the db 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto:{
    secret,
  }
})

store.on("error",function (e){
  console.log("session store error",e);
})

// setting up express session 
const sessionConfig = ({
  // passing in the session store 
  store,
  name:"Session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // improve security by preventing access to the cookie via JavaScript. When a cookie is marked as HttpOnly, it can only be transmitted through HTTP requests (such as GET, POST, etc.) and is inaccessible to client-side JavaScript.
    
    // secure: true,
    // ensures that the cookie is only sent to the server over secure, encrypted connections such as HTTPS. If a cookie has the Secure attribute, the browser will never send it over an unencrypted HTTP connection

    expires: Date.now() + 1000 * 60 * 60 * 24 *7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
})
app.use(session(sessionConfig))

// to use flash messages
app.use(flash());


// setting up helmet 
app.use(helmet()) ; 

// configuring helmet.contentSecurityPolicy header so that it allows resources from external sites 
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
  "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/df4v2cbdf/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



// configuring passport (to be done after sessions) 
app.use(passport.initialize());
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// defining a middleware for flash messages and setting a local variable that will automatically passed to all templates 
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  // req.user is a property which have all the info about the currently logged in user (used in adding login in showing login and register in navbar)
  res.locals.currentUser = req.user;

  next();
})


// for the user routes (not setting any prefix) 
app.use('/',userRoutes)


// for the Campground routes and setting the prefix path
app.use("/campgrounds", campgroundRoutes);


// for the Review routes and setting the prefix path
// yha pe apan ne na prefix mei :id daali h which means we have to access it req.params but router to apna dusri file mei h 
// so to preserve the req.params values from the parent router we have to do {mergeParams:true} in that file inside express.Router()
app.use('/campgrounds/:id/reviews',reviewRoutes);



app.get("/", (req, res) => {
  res.render("home.ejs");
});






// route to match all url that doesnt match our defined urls 
app.all('*',(req,res,next) =>{
    next(new ExpressError('Page not found' , 404))
})



// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs',{err})
});

app.listen(3000, () => {
  console.log("on port 3000");
});
