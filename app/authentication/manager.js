var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");

class AuthenticationManager
{
    constructor (db, secret)
    {
        this.db = db;
        this.secret = secret;
    }

    signIn (user)
    {
        return this.db.User.findByUsername(user.username)
        .then((u) => u.validatePassword(user.password))
        .then((valid) => 
        {
            if (valid)
            {
                var payload = { id: user.id, username: user.username };
                var token = jwt.sign(payload, this.secret, { expiresIn: 31536000 });
                return Promise.resolve(token);
            }
            else
            {
                var err = new Error("Authentication failed");
                err.name = "AuthenticationError";
                err.status = 403;
                throw err;
            }
        });

    }

    refresh (token)
    {
        var user = jwt.decode(token, this.secret);

        return this.db.User.findByUsername(user.username)
        .then((u) =>
        {
            var refreshedToken = jwt.sign(payload, this.secret, { expiresIn: 31536000 });
            return Promise.resolve(refreshedToken);
        });
        
    }

    verify (req, res, next)
    {
        return expressJwt({ secret: this.secret })(req, res, next);
    }
}

module.exports = AuthenticationManager;