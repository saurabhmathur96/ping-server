var path = require("path");
var User = require(path.join(__dirname, "..", "models", "user"));
var HttpStatus = require("http-status");

class UserController
{
    constructor (db) 
    {
        this.db = db;
    }

    // /users
    registerUser (req, res, next)
    {
        var newUser = new User({ username: req.body.username, password: req.body.password });

        newUser.hashPassword()
        .then((user) => this.db.Users.add(user))
        .then((user) => res.status(HttpStatus.CREATED)
                           .json({ id: user.id, username: user.username, topics: user.topics }))
        .catch(next);
    }

    // /users
    deleteUser (req, res, next)
    {
        this.db.Users.removeByUsername(req.user.username)
        .then(() => res.json({  }))
        .catch(next);
    }




}

module.exports = UserController;