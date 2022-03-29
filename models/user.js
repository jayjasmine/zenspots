const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require ('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// passport plugin.. will add on field for username, password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

