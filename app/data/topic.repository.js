var mongoose = require("mongoose");
var path = require("path");
var Topic = require(path.join(__dirname, "..", "models", "topic"));

var TopicSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: "topic name is required" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

var _model = mongoose.model("Topic", TopicSchema);


class TopicRepository
{
    static add(topic)
    {
        return new _model(topic).save()
                                .then((doc) => new Topic(doc));
    }

    static byName (topicName)
    {
        return _model.findOne({ name: topicName }).populate("createdBy")
                     .then((doc) => new Topic(doc));
    }

    static byId(topicId)
    {
        return _model.findById(topicId).populate("createdBy")
                     .then((doc) => new Topic(doc));
    }

    static byUserId(userId)
    {
        return _model.findOne({ createdBy: userId }).populate("createdBy")
                     .then((doc) => new Topic(doc));
    }

    static removeById (topicId)
    {
        return _model.findByIdAndRemove(topicId);
    }
}

module.exports = TopicRepository;