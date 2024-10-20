// this file is to seed the data into the db (we have 2 files to seed data from - cities.js and seedHelpers.js) 

const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers.js')


mongoose.connect("mongodb://127.0.0.1:27017/camp-quest")
const db = mongoose.connection;
db.on('error', (error)=>{
    console.log(error);
});
db.once('open', ()=>{
    console.log('Connected to MongoDB');
});

// to choose random elements from a array we do this - array[Math.floor(Math.random() * array.length)] 
const sample = (array) => array[Math.floor(Math.random() * array.length)]
// we are doing this bcs we have to combine elements from 2 arrays in our seedHelpers.js . we are making a title by combining 2 random words form 2 arrays 


const seedDB = async () =>{
    // this line is done to any previous data in our db so we acn start fresh 
    await Campground.deleteMany({})
    // now we can seed the data into the db

    // we want 50 campgrounds to be made (location we take from cities.js and title we take from seedHelpers.js)
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000)
        // bcs there are 1000 cities and we are choosing randomly 
        const price = (Math.floor(Math.random() * 9) + 2) * 50;
        const camp = new Campground({
            author : '671387f36ec6c7b0169914ac' ,
            // location: `${cities[random1000].city} , ${cities[random1000].state}`,
            location: `${cities[i].city} , ${cities[i].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'This is a sample campground . You can always create your own one and dont forget to add beautiful pictures',
            price,
            geometry: {
                type: 'Point',
                coordinates: [ 
                    cities[i].longitude,
                    cities[i].latitude,
                    // in GeoJSON longitude comes first
                ]
            },
            images : [
                {
                  url: 'https://res.cloudinary.com/df4v2cbdf/image/upload/v1728750150/YelpCamp/kxwylpwvmnqqufxht4z3.png',
                  filename: 'YelpCamp/kxwylpwvmnqqufxht4z3',
                },
                {
                  url: 'https://res.cloudinary.com/df4v2cbdf/image/upload/v1728812449/YelpCamp/zgkh0ihtmqss1pghpecb.jpg',
                  filename: 'YelpCamp/zgkh0ihtmqss1pghpecb'
                }
            ]
        })
        await camp.save()
    }
    console.log('Database seeded');
}

// calling the fn
seedDB()
.then(() => {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
})
.catch(error => {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
});


