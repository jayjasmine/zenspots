process.env.NODE_ENV = "test";
const chai = require('chai'),
    chaiHttp = require('chai-http');
const expect = require("chai").expect;
const User = require("../../../models/user");
const app = require("../../../app.js");
chai.use(chaiHttp);

async function clearCollections() {
    await Zenspot.deleteMany({});
}

clearCollections();


const newUser = new User({
    username: 'test',
    password: 'test',
    usertype: 'user',
});

describe("GET /register", async () => {
    it("OK, getting register page works", (done) => {
        chai.request(app)
            .get('/register')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});
describe("POST /register", async () => {
    it("OK, posting user works", (done) => {
        chai.request(app)
            .post(`/register`)
            .send(newUser)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});
describe("POST /Login", async () => {
    it("OK, posting user works", (done) => {
        chai.request(app)
            .post(`/login`)
            .send(newUser)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});
describe("GET /Login", async () => {
    it("OK, getting myaccount page works", (done) => {
        chai.request(app)
            .get('/login')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});
describe("GET /myaccount", async () => {
    it("OK, getting myaccount page works", (done) => {
        chai.request(app)
            .get('/myaccount')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});
