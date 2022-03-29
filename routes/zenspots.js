const express = require("express");
router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
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

router.get("/new", (req, res) => {
  res.render("zenspots/new");
});

//Make new Zenspot
router.post(
  "/",
  validateZenspot,
  catchAsync(async (req, res) => {
    //if (!req.body.zenspot) throw new ExpressError('Invalid Zenspot data', 400)
    const zenspot = new Zenspot(req.body.zenspot);
    await zenspot.save();
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    //create variable that uses zenspot model, find by the requests json parameter
    const zenspot = await Zenspot.findById(req.params.id).populate("comments");
    //render the variable
    res.render("zenspots/show", { zenspot });
  })
);

//Edit route
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const zenspot = await Zenspot.findById(req.params.id);
    res.render("zenspots/edit", { zenspot });
  })
);

router.put(
  "/:id",
  validateZenspot,
  catchAsync(async (req, res) => {
    //store id from params into id variable
    const { id } = req.params;
    //Spread syntax takes all values of keys in request object (from form) and passes them in as individual arguments) so we can just use ... instead of title, location
    const zenspot = await Zenspot.findByIdAndUpdate(id, {
      ...req.body.zenspot,
    });
    res.redirect(`/zenspots/${zenspot._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Zenspot.findByIdAndDelete(id);
    res.redirect("/zenspots");
  })
);

module.exports = router;
