const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const ZenspotSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    comments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment'
    }]
})

//Query middleware is triggered to delete all comments when Zenspot is deleted
ZenspotSchema.post('findOneAndDelete', async function (doc) {
    //if there is a document
    if (doc) {
        //delete all documents where there is a comment
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Zenspot', ZenspotSchema)