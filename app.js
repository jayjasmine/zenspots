const express = require("express");
//add node path module
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./helpers/ExpressError");
const methodOverride = require("method-override");
const morgan = require("morgan");
const AppError = require("./AppError");
const { join } = require("path");
// const { ppid } = require("process");

//routes
const zenspots = require('./routes/zenspots')
const comments = require('./routes/comments')

//connect database
mongoose.connect("mongodb://localhost:27017/zen-spot"),
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

//log if theres an error to db connection and if db successfully connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

//Code for views
app.engine("ejs", ejsMate);
//set view engine to ejs
app.set("view engine", "ejs");
//set views folder to current directory of this file(app.js) and look for the folder views
app.set("views", path.join(__dirname, "views"));

//Point app to use public folder for assets/css
app.use(express.static(path.join(__dirname, "public")));

///////     Middleware (runs code before every request)     //////

//log request using morgan
app.use(morgan("tiny"));
//Tell express to parse request body
app.use(express.urlencoded({ extended: true }));
//set string to use methodOverride to fake HTTP requests
app.use(methodOverride("_method"));

//404 middleware
// app.use((req, res) => {
//     res.status(404).send('404 Not Found');
//     //render view
// })





app.use('/zenspots', zenspots)
app.use('/zenspots/:id/comments', comments)

/////// End Middleware ///////

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/users/myaccount", (req, res) => {
  res.render("users/myaccount");
});



//for all requests, and all paths
app.all("*"),
  (req, res, next) => {
    next(new ExpressError("Page not found", 404));
  };

//custom error handler to replace the default
app.use((err, req, res, next) => {
  //set defailt status code/message
  const { statusCode = 500 } = err;
  //if no error, set default
  if (!err.message) err.message = "Something went wrong!";
  //extract err
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
