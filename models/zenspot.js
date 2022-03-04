const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ZenspotSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Zenspot', ZenspotSchema)