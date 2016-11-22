var path = require("path");
var ObjectId = require("mongoose").Schema.Types.ObjectId;
var Topic = require(path.join(__dirname, "..", "models", "topic"));
var HttpStatus = require("http-status");
var AuthorizationError = require(path.join(__dirname, "..", "errors", "authorization"));
var NotFoundError = require(path.join(__dirname, "..", "errors", "notfound"));

class TopicController
{
    constructor (db) 
    {
        this.db = db;
    }

    //
    // /topics
    createTopic (req, res, next)
    {
        var newTopic = new Topic({ name: req.body.name, createdBy: req.user.id });
        
        this.db.Topics.add(newTopic)
        .then((topic) => Promise.all([this.db.Users.followTopic(req.user.username, topic.id), Promise.resolve(topic)]))
        .then(([user, topic]) => res.status(HttpStatus.CREATED).json({
            id: topic.id,
            name: topic.name,
            createdBy: {
                id: user.id,
                username: user.username
            }
        }))
        .catch(next);
    }

    //
    // /topics/:topicId
    deleteTopic (req, res, next)
    {
        
        this.db.Topics.byId(req.params.topicId)
        .then((topic) => 
        {
            if (topic == null)
            {
                throw new NotFoundError("topic not found.");
            }
            if (topic.createdBy.username !== req.user.username)
            {
                throw new AuthorizationError("you cannot delete this topic.");
            }
            else
            {
                return this.db.Topics.removeById(topic.Id);
            }
        })
        .then(() => res.json({  }))
        .catch(next);
    }
    
    //
    // /topics/:topicId
    getTopic (req, res, next)
    {
        Promise.all([
            this.db.Topics.byId(req.params.topicId),
            this.db.Users.byTopic(req.params.topicName)
        ])
        .then(([topic, followers]) => res.json({
            id: topic.id,
            name: topic.name,
            createdBy: topic.createdBy,
            followers: followers
        }))
        .catch(next);
    }

    //
    // /topics/:topicId/unfollow
    followTopic (req, res, next)
    {
        this.db.Users.followTopic(req.user.username, req.params.topicId)
        .then((user) => res.json({ id: user.id, username: user.username, topics: user.topics }))
        .catch(next);
    }

    //
    // /topics/:topicId/follow
    unfollowTopic (req, res, next)
    {
        this.db.Users.unfollowTopic(req.user.username, req.params.topicId)
        .then((user) => res.json({ id: user.id, username: user.username, topics: user.topics }))
        .catch(next);
    }

    
}

module.exports = TopicController;