class TokenController
{
    constructor (db, authenticationManager) 
    {
        this.db = db;
        this.authenticationManager = authenticationManager;
    }


    generateToken (req, res, next)
    {
        var user = new this.db.User ({ username: req.body.username, password: req.body.password });
        this.authenticationManager.signIn(user)
        .then((token) => res.json({ token: token }))
        .catch(next);
    }

    refreshToken (req, res, next)
    {
        this.authenticationManager.refreshToken(req.user)
        .then((token) => res.json({ refreshedToken: token }))
        .catch(next);
    }


}

module.exports = TokenController;