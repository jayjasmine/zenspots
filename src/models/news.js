const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: String,
    body: String

})

module.exports = mongoose.model("News", newsSchema);