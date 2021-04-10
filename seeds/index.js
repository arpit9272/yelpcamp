const mongoose = require("mongoose")
const Campground = require("../models/campground");
const cities = require("./cities");
const {descriptors, places} = require("./seedHelpers")

mongoose
  .connect("mongodb://localhost/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})

const sample = arr => arr[Math.floor(Math.random()*arr.length)]

const seedB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam quos dicta debitis quam odio perspiciatis earum accusantium nulla optio cum rerum, provident alias laboriosam illo corrupti, corporis at. Delectus, animi!'
        })
        await camp.save()
    }

}
seedB().then(()=> {
  mongoose.connection.close();
})