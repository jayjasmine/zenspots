const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const News = require("../models/news");
const Comment = require("../models/comment");
const Zenspot = require("../models/zenspot");

//api endpoint for admin to create user 
router.post("/admin/createUser", catchAsync(async (req, res) => {
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


router.post("/admin/createNews", catchAsync(async (req, res) => {
    const formData = req.body
    const news = new News({
        title: formData.title,
        body: formData.body
    });
    console.log(formData);
    await news.save();
    res.redirect('/admin');
}))

router.post("/admin/createZenspot", catchAsync(async (req, res) => {
    const {
        title,
        location,
        image,
        description
    } = req.body
    const zenspot = new Zenspot({
        title,
        location,
        image,
        description
    });
    console.log(zenspot);
    await zenspot.save();
    res.redirect('/admin');
}))

router.post("/admin/createComment", catchAsync(async (req, res) => {
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


router.get("/admin/showZenspots", catchAsync(async (req, res) => {
    const zenspots = await Zenspot.find({});
    res.json(zenspots)
}))
router.get("/admin/showUsers", catchAsync(async (req, res) => {
    const users = await User.find({});
    res.json(users)
}))
router.get("/admin/showComments", catchAsync(async (req, res) => {
    const comments = await Comment.find({});
    res.json(comments)
}))
router.get("/admin/showNews", catchAsync(async (req, res) => {
    const news = await News.find({});
    res.json(news)
}))

module.exports = router;