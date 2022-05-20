const express = require("express");
router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const News = require("../models/news");
const Comment = require("../models/comment");
const Zenspot = require("../models/zenspot");
const Joi = require('joi')
const isLoggedIn = require("../middleware");
const isAdmin = require("../checkAdmin");
const ipfilter = require('express-ipfilter').IpFilter

// var cookieParser = require('cookie-parser')
var csrf = require('csurf')
// var bodyParser = require('body-parser')
// var parseCookie = cookieParser();
var csrfProtection = csrf();


const ips = ['::1'];


//Middleware function to validate data before inserting into MongoDB
const validateZenspot = (req, res, next) => {
    // console.log(req.body)
    const schema = Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    });
    const {
        error
    } = schema.validate(req.body);
    //If error var exists, map over the details array to get a single message string, save into msg var
    //throw ExpressErrorfunction
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

//Middleware function to validate data before inserting into MongoDB
const validateNews = (req, res, next) => {
    // console.log(req.body)
    const schema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
    });
    const {
        error
    } = schema.validate(req.body);
    //If error var exists, map over the details array to get a single message string, save into msg var
    //throw ExpressErrorfunction
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


//api endpoint for admin to create user 
router.post("/admin/createUser", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    console.log(req.body);
    try {
        const {
            email,
            username,
            password,
            usertype
        } = req.body;

        //create new user with email and username from req body
        const user = new User({
            email,
            username,
            usertype,
        });
        //use passport-local-mongoose function .register() to create new user with user data from req.body and create hashed and salted password
        const registeredUser = await User.register(user, password);
        req.flash("success", "user created");
        res.redirect('/admin');
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/admin");
    }
}))


router.post("/admin/createNews", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), validateNews, csrfProtection, catchAsync(async (req, res) => {
    const formData = req.body
    const news = new News({
        title: formData.title,
        body: formData.body
    });
    await news.save()
        .then((result) => {
            console.log('news post created')
            req.flash("success", `Successfully made a news post ${news.title}`);
            res.status(200).json("News post created!")
            // res.render('/adminvue');
        })
        .catch((error) => {
            console.log('failed to post news')
            req.flash("error", "Failed to make news post");
            res.status(500).json("query error - failed to create news post")
            // res.render('/adminvue');
        })

}))

router.post("/admin/createZenspot", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), validateZenspot, csrfProtection, catchAsync(async (req, res) => {
    const zenspot = new Zenspot({
        title: req.body.title,
        location: req.body.location,
        image: req.body.image,
        description: req.body.description
    });
    await zenspot.save()
        .then((result) => {
            console.log('zenspot created')
            req.flash("success", `Successfully made a new zenspot ${zenspot.title}`);
            res.status(200).json("zenspot created!")
            // res.render('/adminvue');
        })
        .catch((error) => {
            console.log('failed to make zenspot')
            req.flash("error", "Failed to make new Zenspot");
            res.status(500).json("query error - failed to create zenspot")
            // res.render('/adminvue');
        })



}))

router.post("/admin/createComment", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    const zenspot = await Zenspot.findById(req.body.id);
    //A new comment is made with the body content of the req object and saved to var comment
    const comment = new Comment({
        body: req.body.body
    });
    console.log(comment);
    //comment body pushed to zenspot comments property since its an array
    zenspot.comments.push(comment);
    //Wait for data to save to database then return 200
    await comment.save();
    await zenspot.save();
    res.status(200)
    req.flash('success', 'Successfully created a new comment');
    res.redirect('/admin');
}))


router.get("/admin/showZenspots", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    const zenspots = await Zenspot.find({});
    res.json(zenspots)
}))
router.get("/admin/showUsers", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    const users = await User.find({});
    res.json(users)
}))
router.get("/admin/showComments", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    const comments = await Comment.find({});
    res.json(comments)
}))
router.get("/admin/showNews", isLoggedIn, isAdmin, ipfilter(ips, {
    mode: 'allow'
}), catchAsync(async (req, res) => {
    const news = await News.find({});
    res.json(news)
}))

module.exports = router;