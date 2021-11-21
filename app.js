const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")


app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate)

app.use(express.static(path.join(__dirname,"public")))

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000
  }
}
app.use(session(sessionConfig))
app.use(flash())
//Use passport session after the actual session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose
  .connect("mongodb://localhost/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})

app.use((req,res,next)=>{
  console.log(req.session)
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
})


app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews",reviewRoutes)
app.use("/",userRoutes)

app.get("/", (req,res) => {
  res.render('home')
})



app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404))
})

app.use((err, req, res, next) => {
  const {statusCode=500, message="Something went wrong"} = err
  // res.status(statusCode).send(message)
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})