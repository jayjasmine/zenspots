process.env.NODE_ENV = "test";
const express = require("express")
const router = express.Router()


const Comment = require("../../../models/comment");
const Zenspot = require("../../../models/zenspot");


async function clearCollections() {
    await Zenspot.deleteMany({});
}

clearCollections();



const newZenspot = new Zenspot({
    title: 'title',
    image: 'image path',
    description: 'lorem ipsum',
    location: 'brisbane'
});

newZenspot.save();

let newComment = new Comment({
    body: 'comment text'
})
newZenspot.comments.push(newComment);
console.log(newZenspot);

describe(`POST /zenspots/${newZenspot._id}/comments/`, async () => {
    it("OK, getting all comments works", (done) => {



        done();

        // router.post(
        //     `/zenspots/${newZenspot._id}/comments/`, async (req, res) => {  
        //         newZenspot.comments.push(newComment);
        //         res.status(200)
        //         done();
        //     })
    })
});