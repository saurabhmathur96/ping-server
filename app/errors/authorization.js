var HttpStatus = require("http-status");

class AuthorizationError extends Error
{
    constructor (message)
    {
        super(message);
        this.name = "AuthorizationError";
        this.status = HttpStatus.UNAUTHORIZED
    }
}

module.exports = AuthorizationError;