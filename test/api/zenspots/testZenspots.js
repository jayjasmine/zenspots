process.env.NODE_ENV = "test";
const chai = require('chai'), chaiHttp = require('chai-http');
const expect = require("chai").expect;
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

describe("GET /home", async () => {
    it("OK, getting home page works", (done) => {
        chai.request(app)
            .get('/')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});

describe("GET /zenspots", async () => {
    it("OK, getting all zenspot works", (done) => {
        chai.request(app)
            .get('/zenspots')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        
    })
});


describe("GET /zenspots/:id", async () => {
    it("OK, getting one zenspot works", (done) => {
        chai.request(app)
            .get(`/zenspots/${newZenspot._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        
    })
});

describe("GET /zenspots/new", async () => {
    it("OK, getting new zenspot page works", (done) => {
        chai.request(app)
            .get('/zenspots/new')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});

describe("POST /zenspots", async () => {

    it("OK, creating a zenspot works", (done) => {
        chai.request(app)
            .post('/zenspots')
            .send({
                title: "test title",
                image: "test.com/image.png",
                description: "test description",
                location: "test location"
            }).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        
    })
});

describe("PUT /zenspots/:id", async () => {

    it("OK, EDITING a zenspot works", (done) => {
        chai.request(app)
            .put(`/zenspots/${newZenspot._id}`)
            .send({
                title: "test title2",
                image: "test.com/image.png",
                description: "test description",
                location: "test location"
            }).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        
    })
});

describe("DELETE /zenspots/id", async () => {

    it("OK, deleting a zenspot works", (done) => {
        chai.request(app)
            .delete(`/zenspots/${newZenspot._id}`)
            .send({
                title: "test title",
                image: "test.com/image.png",
                description: "test description",
                location: "test location"
            }).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        
    })
});

