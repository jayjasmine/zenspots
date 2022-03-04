const express = require('express');
//add node path module
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Zenspot = require('./models/zenspot');
const morgan = require('morgan')


//connect database
mongoose.connect('mongodb://localhost:27017/zen-spot'),{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

//log if theres an error to db connection and if db successfully connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

//Code for views
app.engine('ejs', ejsMate)
//set view engine to ejs
app.set('view engine', 'ejs')
//set views folder to current directory of this file(app.js) and look for the folder views
app.set('views', path.join(__dirname, 'views'))

//Point app to use public folder for assets/css
app.use(express.static(path.join(__dirname, 'public')))

///////     Middleware (runs code before every request)     //////
//log request using morgan
app.use(morgan('tiny'));
//Tell express to parse request body
app.use(express.urlencoded({extended: true}))
//set string to use methodOverride to fake HTTP requests
app.use(methodOverride('_method'))


// //404 middleware
// app.use((req, res) => {
//     res.status(404).send('404 Not Found');
//     //render view
// })

/////// End Middleware ///////

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/users/myaccount', (req, res) => {
    res.render('users/myaccount');
})

//open route /zenspots, execute async promise function
app.get('/zenspots', async (req, res) => {
    //get all records, store in zenspots variable
    const zenspots = await Zenspot.find({})
    res.render('zenspots/index', {zenspots})
});



app.get('/zenspots/new', (req, res) => {
    res.render('zenspots/new');
})

app.post('/zenspots', async(req, res) => {
    const zenspot = new Zenspot(req.body.zenspot);
    await zenspot.save();
    res.redirect(`/zenspots/${zenspot._id}`)
})

app.get('/zenspots/:id', async(req, res) => {

    //create variable that uses zenspot model, find by the requests json paramater
    const zenspot = await Zenspot.findById(req.params.id)
    //render the variable
    res.render('zenspots/show', { zenspot });
});

//Edit route
app.get('/zenspots/:id/edit', async(req, res) => {
    const zenspot = await Zenspot.findById(req.params.id)
    res.render('zenspots/edit', { zenspot });
})

app.put('/zenspots/:id', async (req, res) => {
    //store id from params into id variable
    const {id} = req.params;
    //Spread syntax takes all values of keys in request object (from form) and passes them in as individual arguments) so we can just use ... instead of title, location
    const zenspot = await Zenspot.findByIdAndUpdate(id, { ...req.body.zenspot})
    res.redirect(`/zenspots/${zenspot._id}`)
})

// app.get('/makezenspot', async (req, res) => {
//     const zen = new Zenspot({title: 'My Zenspot', description: 'great spot to meditate!'})
//     await zen.save();
//     res.send(zen)
// })

app.delete('/zenspots/:id', async (req, res) => {
    const {id} = req.params;
    await Zenspot.findByIdAndDelete(id);
    res.redirect('/zenspots');
})


app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})
