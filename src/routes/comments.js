const express = require("express");
//set merge params true to access zenspot Id parameter
router = express.Router({mergeParams: true});
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const Comment = require("../models/comment");
const Zenspot = require("../models/zenspot");
const { commentSchema } = require("../schemas.js");

//Middleware function to validate data before inserting into MongoDB
const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//End middleware

//Create new comment
router.post(
  "/",
  //Executing field validation with the help of JOI
  validateComment,
  //Execute catch async function to catch errors and send to error handler
  catchAsync(async (req, res) => {
    //Zenspot id taken from cross references URL param id with zenspot ID in collection
    const zenspot = await Zenspot.findById(req.params.id);
    //A new comment is made with the body content of the req object and saved to var comment
    const comment = new Comment(req.body.comment);
    //comment body pushed to zenspot comments property since its an array
    zenspot.comments.push(comment);
    //Wait for data to save to database then return 200
    await comment.save();
    await zenspot.save();
    res.status(200)
    req.flash('success', 'Successfully created a new comment');
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

router.delete(
  "/:commentId",
  //Execute catch async function to catch errors and send to error handler
  catchAsync(async (req, res) => {
    //destruture id and comment id from req params
    const { id, commentId } = req.params;
    //Use $pull to remove from comment from comments array with commentId
    await Zenspot.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    //Delete commentId from comments
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success', 'Successfully deleted comment');
    res.redirect(`/zenspots/${id}`);
  })
);

module.exports = router;
