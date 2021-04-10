const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate)

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


app.get("/", (req,res) => {
    res.render('home')
})

app.get("/campgrounds",async (req,res) => {
  const campgrounds = await Campground.find({})
  res.render("campgrounds/index",{campgrounds})
})

app.get("/campgrounds/new", (req,res) => {
  res.render("campgrounds/new")
})

app.get("/campgrounds/:id", async(req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id)
  res.render("campgrounds/show",{campground})
})

app.post("/campgrounds", async(req,res) => {
  const {title, location,price,description,image} = req.body.campground;
  const newCampground = new Campground({
    title,
    location,
    price,
    description,
    image
  })
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`)
})

app.get("/campgrounds/:id/edit",async (req,res) => {
  const {id} = req.params
  const campground = await Campground.findById(id)
  res.render("campgrounds/edit", {campground})
})

app.put("/campgrounds/:id", async (req, res) => {
  const {id} = req.params;
  // const {title, location} = req.body.campground;
  // const campground = await Campground.findByIdAndUpdate(id, {title, location})
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete("/campgrounds/:id", async(req,res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds")
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})