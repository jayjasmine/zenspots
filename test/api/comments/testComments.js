process.env.NODE_ENV = "test";
const chai = require('chai'),
    chaiHttp = require('chai-http');
const expect = require("chai").expect;
const Comment = require("../../../models/comment");
const Zenspot = require("../../../models/zenspot");
const app = require("../../../app.js");

chai.use(chaiHttp);

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

const newComment = new Comment({
    body: 'comment text'
})


describe(`GET /zenspots/${newZenspot._id}/comments/`, async () => {
    it("OK, getting all comments works", (done) => {
        chai.request(app)
            .get('/zenspots')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});

describe(`DELETE /zenspots/${newZenspot._id}/comments/`, async () => {
    it("OK, deleting a comment works", (done) => {
        chai.request(app)
            .delete(`/zenspots/${newZenspot._id}/comments/${newComment._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});


//still need to add, create comment + delete comment scripts