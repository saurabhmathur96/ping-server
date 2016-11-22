var mongoose = require("mongoose");
var path = require("path");
var User = require(path.join(__dirname, "..", "models", "user"));

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: "username is required." },
    password: { type: String, required: "password is required." },
    topics: { type: [mongoose.Schema.Types.ObjectId], required: false, default: [], ref: "Topic" }
});

var _model = mongoose.model("User", UserSchema);


class UserRepository
{
    static add(user)
    {
        return new _model(user).save()
                               .then((doc) => new User(doc));
    }
    
    static byUsername(username)
    {
        return _model.findOne({ username: username })
                     .then((doc) => new User(doc));
    }

    static byId(userId)
    {
        return _model.findById(userId)
                     .then((doc) => new User(doc));
    }
    
    static followTopic(username, topicId)
    {
        return _model.findOneAndUpdate({ username: username }, 
                                       { $addToSet: { topics: topicId } }, 
                                       { new: true })
                     .then((doc) => new User(doc));
    }

    static unfollowTopic(username, topicId)
    {
        return _model.findOneAndUpdate({ username: username }, 
                                       { $pull: { topics: topicId } }, 
                                       { new: true })
                     .then((doc) => new User(doc));
    }

    static byTopic(topicId)
    {
        return _model.find("username", { topics: topicId })
                     .then((docs) => docs.map(each => new User(each)));
    }

    static removeByUsername (username)
    {
        return _model.findOneAndRemove({ username: username })
    }
}

module.exports = UserRepository;