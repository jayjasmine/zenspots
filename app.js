const express = require("express");
//add node path module
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./helpers/ExpressError");
const methodOverride = require("method-override");
const morgan = require("morgan");
const AppError = require("./AppError");
const { join } = require("path");
// const { ppid } = require("process");

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//routes
const zenspotRoutes = require('./routes/zenspots')
const commentRoutes = require('./routes/comments')
const userRoutes = require('./routes/users')

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

//Session code//
const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    //store
    cookie: {
        httpOnly: true,
        //expire in a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
//flash messages after action
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//Tell passport to use the Local Strategy, point autentiaction to user model
passport.use(new LocalStrategy(User.authenticate()));
//Tell passport how to serialize user (how to store user in the session)
passport.serializeUser(User.serializeUser());
//Tell passport how to remove user from session
passport.deserializeUser(User.deserializeUser());

//////////////////////////////////////////////////////////////////
///////     Middleware (runs code before every request)     //////
//////////////////////////////////////////////////////////////////

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

//On every request, wwhatever is in flash object under success save to locals under the key sucess
app.use((req, res, next) => {
    console.log(req.session)
    //give all templates access to currently signed in user details
    res.locals.signedInUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/zenspots', zenspotRoutes)
app.use('/zenspots/:id/comments', commentRoutes)

/////// End Middleware ///////

app.get("/", (req, res) => {
  res.render("home");
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
