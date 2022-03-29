const express = require("express");
router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const isLoggedIn = require("../middleware");
const Zenspot = require("../models/zenspot");
const { zenspotSchema } = require("../schemas.js");

//Middleware function to validate data before inserting into MongoDB
const validateZenspot = (req, res, next) => {
  //Validate the JSON body against zenspotScheme in schemas.js and save error into var
  const { error } = zenspotSchema.validate(req.body);
  //If error var exists, map over the details array to get a single message string, save into msg var
  //throw ExpressErrorfunction
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//open route /zenspots, execute async promise function
router.get(
  "/",
  catchAsync(async (req, res) => {
    //get all records, store in zenspots variable
    const zenspots = await Zenspot.find({});
    res.render("zenspots/index", { zenspots });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("zenspots/new");
});

//Make new Zenspot
router.post(
  "/",
  isLoggedIn,
  validateZenspot,
  catchAsync(async (req, res) => {
    //if (!req.body.zenspot) throw new ExpressError('Invalid Zenspot data', 400)
    const zenspot = new Zenspot(req.body.zenspot);
    await zenspot.save();
    req.flash("success", "Successfully made a new zenspot");
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

//Show individual Zenspot
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    //create variable that uses zenspot model, find by the requests json parameter
    const zenspot = await Zenspot.findById(req.params.id).populate("comments");
    //if zenspot has been deleted flash error and redirect to zenspots page
    if (!zenspot) {
      req.flash("error", "Cannot find that zenspot");
      res.redirect("/zenspots");
    }
    //render the zenspot information
    else res.render("zenspots/show", { zenspot });
  })
);

//Show edit Zenspot page
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const zenspot = await Zenspot.findById(req.params.id);
    if (!zenspot) {
      req.flash("error", "Cannot find that zenspot");
      res.redirect("/zenspots");
    } else res.render("zenspots/edit", { zenspot });
  })
);
//Send updated Zenspot data
router.put(
  "/:id",
  isLoggedIn,
  validateZenspot,
  catchAsync(async (req, res) => {
    //store id from params into id variable
    const { id } = req.params;
    //Spread syntax takes all values of keys in request object (from form) and passes them in as individual arguments) so we can just use ... instead of title, location
    const zenspot = await Zenspot.findByIdAndUpdate(id, {
      ...req.body.zenspot,
    });
    req.flash("success", "Successfully updated Zenspot");
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

//Delete zenspot route
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Zenspot.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Zenspot");
    res.redirect("/zenspots");
  })
);

module.exports = router;
