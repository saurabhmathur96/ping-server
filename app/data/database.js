var path = require("path");
var UserRepository = require(path.join(__dirname, "user.repository"));
var TopicRepository = require(path.join(__dirname, "topic.repository"));
var mongoose = require("mongoose");

class Database
{
    constructor (uri)
    {
        mongoose.connect(uri);
    }

    get Users ()
    {
        return UserRepository;
    }

    get Topics ()
    {
        return TopicRepository;
    }
}
module.exports = Database;