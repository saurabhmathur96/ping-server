var path = require("path");
var User = require(path.join(__dirname, "..", "models", "user"));

class TokenController
{
    constructor (db, authenticationManager) 
    {
        this.db = db;
        this.authenticationManager = authenticationManager;
    }

    //
    // /tokens
    generateToken (req, res, next)
    {
        var user = new User({ username: req.body.username, password: req.body.password });
        
        this.authenticationManager.signIn(user)
        .then((token) => res.json({ token: token }))
        .catch(next);
    }

    //
    // /tokens/refresh
    refreshToken (req, res, next)
    {
        this.authenticationManager.refreshToken(req.user)
        .then((token) => res.json({ refreshedToken: token }))
        .catch(next);
    }


}

module.exports = TokenController;