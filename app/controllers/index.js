var path = require("path");
var UserController = require(path.join(__dirname, "user"));
var TokenController = require(path.join(__dirname, "token"));
var NewsItemController = require(path.join(__dirname, "newsitem"));

var express = require("express");

//
// Configure routes

module.exports = function (db, authenticationManager)
{
    var router = express.Router();

    var verify = authenticationManager.verify.bind(authenticationManager);

    // user routes
    var users = new UserController(db);
    router.post("/users/", users.registerUser.bind(users));
    router.get ("/users/:username", verify, users.fetchByUsername.bind(users));

    // token authentication routes
    var tokens = new TokenController(db, authenticationManager);
    router.post("/tokens", tokens.generateToken.bind(tokens));
    router.get ("/tokens/refresh", verify, tokens.refreshToken.bind(tokens));

    // newsitems routes
    router.use("/newsitems", verify);
    
    var newsitems = new NewsItemController(db);
    router.get ("/newsitems", newsitems.fetchItems.bind(newsitems));
    router.post("/newsitems", newsitems.addItem.bind(newsitems));
    router.get ("/newsitems/:itemid", newsitems.fetchItemById.bind(newsitems));
    


    return router;

};