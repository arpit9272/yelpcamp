const express = require("express")
const router = express.Router();
const catchAsync = require("../utils/catchAsync")

const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req,res)=>{
    res.render("users/register")
})

router.post("/register", catchAsync(async (req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const user = await new User({email,username})
        const registeredUser = await User.register(user,password)
        req.login(registeredUser, err=>{
            if(err) next(err);
            req.flash("success","Welcome to Yelp Camp!")
            res.redirect("/campgrounds")
        })
       
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req,res)=>{
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", {failureFlash:true, failureRedirect: "/login"}), (req,res)=>{
    
    const redirectUrl = req.session.returnTo || "/campgrounds"
    req.flash("success", "Welcome back!")
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get("/logout", (req,res)=>{
    req.logOut();
    req.flash("success","Goodbye!")
    res.redirect("/campgrounds")
})

module.exports = router;