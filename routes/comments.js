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

router.post(
  "/",
  validateComment,
  catchAsync(async (req, res) => {
    const zenspot = await Zenspot.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    zenspot.comments.push(comment);
    await comment.save();
    await zenspot.save();
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

router.delete(
  "/:commentId",
  catchAsync(async (req, res) => {
    //destruture id and comment id
    const { id, commentId } = req.params;
    //Use $pull to remove from comment from comments array with commentId
    await Zenspot.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    //Delete commentId from comments
    await Comment.findByIdAndDelete(req.params.commentId);
    res.redirect(`/zenspots/${id}`);
  })
);

module.exports = router;
