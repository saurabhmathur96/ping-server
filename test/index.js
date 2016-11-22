var should = require("chai").should();
var supertest = require("supertest");
var HttpStatus = require("http-status");
var path = require("path");
var app = require(path.join(__dirname, "..", "server"));
var client = supertest(app);

var user = {
    username: "admin",
    password: "admin"
};

var topic = {
    name: "test"
}

describe("Test cases", () =>
{
    before((done) =>
    {
        client.post("/api/v1/users/")
        .send({ username: user.username, password: user.password })
        .expect(HttpStatus.CREATED)
        .end((err, res) => 
        {
            should.not.exist(err);

            res.body.username.should.equal(user.username);

            done();
        })
    });

    var token = null;

    beforeEach((done) =>
    {
        client.post("/api/v1/tokens")
        .send({ username: user.username, password: user.password })
        .expect(HttpStatus.OK)
        .end((err, res) => 
        {
            should.not.exist(err);

            token = res.body.token;

            done();
        })
    });


    it("/api/v1/topics : Create new topic", (done) =>
    {
        client.post("/api/v1/topics")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: topic.name })
        .expect(HttpStatus.CREATED)
        .end((err, res) =>
        {
            should.not.exist(err);

            topic.id = res.body.id;

            done();
        });
        
    });


    it(`/api/v1/topics/${topic.id} : Delete a topic`, (done) =>
    {
        client.delete(`/api/v1/topics/${topic.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .end((err, res) =>
        {
            should.not.exist(err);

            done();
        });
        
    });



    after((done) =>
    {
        client.delete("/api/v1/users/")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .end((err, res) =>
        {
            should.not.exist(err);

            done();
        })
    })
})