const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title:String,
    proce:String,
    description: String,
    location: String
})

const Campground = mongoose.model("campground", CampgroundSchema);
module.exports = Campground;