class UserController
{
    constructor (db) 
    {
        this.db = db;
    }


    fetchByUsername (req, res, next)
    {

        Promise.all([
            this.db.User.findByUsername(req.params.username),
            this.db.NewsItem.findByUser(req.params.username)
        ])
        .then(([user, items]) => res.json({ username: user.username, items: items }))
        .catch(next);
    }

    registerUser (req, res, next)
    {
        console.log(req.body);
        var user = new this.db.User({ username: req.body.username, password: req.body.password });
        
        user.create()
        .then((user) => res.status(201).json({ id: user.id, username: user.username }))
        .catch(next);
    }



}

module.exports = UserController;