const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require("./review")

const CampgroundSchema = new Schema({
    title:String,
    image: String,
    price:Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


// There are 2 mongoose middlewares pre and post. pre works before
// the findByIdAndDelete method is executed in app.delete and post
// works after the findByIdAndDelete method is executed in app.delete
// findByIdAndDelete triggers the findOneAndDelete middleware as
// written in mongoose docs
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model("campground", CampgroundSchema);
module.exports = Campground;