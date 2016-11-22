var path = require("path");
var UserController = require(path.join(__dirname, "user"));
var TokenController = require(path.join(__dirname, "token"));
var TopicController = require(path.join(__dirname, "topic"));;

var express = require("express");

//
// Configure routes

module.exports = function (db, authenticationManager)
{
    var router = express.Router();

    var verify = authenticationManager.verify.bind(authenticationManager);

    // user routes
    var users = new UserController(db);
    router.post  ("/users",         users.registerUser.bind(users));
    router.delete("/users", verify, users.deleteUser.bind(users));
    

    // token authentication routes
    var tokens = new TokenController(db, authenticationManager);
    router.post("/tokens",                 tokens.generateToken.bind(tokens));
    router.get ("/tokens/refresh", verify, tokens.refreshToken.bind(tokens));

    // topic routes
    var topics = new TopicController(db);
    router.post   ("/topics",                   verify, topics.createTopic.bind(topics));
    router.get    ("/topics/:topicId",          verify, topics.getTopic.bind(topics));
    router.delete ("/topics/:topicId",          verify, topics.deleteTopic.bind(topics));
    router.post   ("/topics/:topicId/follow",   verify, topics.followTopic.bind(topics));
    router.post   ("/topics/:topicId/unfollow", verify, topics.unfollowTopic.bind(topics));

    return router;

};