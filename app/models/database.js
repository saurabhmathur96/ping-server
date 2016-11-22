var path = require("path");
var UserModel = require(path.join(__dirname, "user"));
var NewsItem = require(path.join(__dirname, "newsitem"));
var mongoose = require("mongoose");

class Database
{
    constructor (uri)
    {
        mongoose.connect(uri);
    }

    get User ()
    {
        return UserModel;
    }

    get NewsItem ()
    {
        return NewsItem;
    }
}
module.exports = Database;