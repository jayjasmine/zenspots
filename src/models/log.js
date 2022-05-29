const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    ip: String,
    sid: String,
    username: String,
    usertype: String,
    timestamp: String,
    action: String,
    endpoint: String
})

module.exports = mongoose.model("Log", logSchema);