var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var HttpStatus = require("http-status");
var path = require("path");
var AuthenticationError = require(path.join(__dirname, "..", "errors", "authentication"));


class AuthenticationManager
{
    constructor (db, secret)
    {
        this.db = db;
        this.secret = secret;
    }

    signIn (user)
    {
        return this.db.Users.byUsername(user.username)
        .then((u) => 
        {
            if (u == null)
            {
                throw new AuthenticationError("Authentication failed.")
            }
            else
            {
                return [u, u.validatePassword(user.password)];
            }
        })                       
        .then(([u, valid]) => 
        {
            if (valid)
            {
                var payload = { id: u.id, username: u.username };
                var token = jwt.sign(payload, this.secret, { expiresIn: 31536000 });
                return Promise.resolve(token);
            }
            else
            {
                throw new AuthenticationError("Authentication failed.");
            }
        });

    }

    refresh (token)
    {
        var user = jwt.decode(token, this.secret);

        return this.db.Users.byUsername(user.username)
        .then((u) =>
        {
            if (u == null)
            {
                throw new AuthenticationError("Invalid token.");
            }
            
            var payload = { id: u.id, username: u.username };
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