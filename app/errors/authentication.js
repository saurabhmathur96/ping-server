var HttpStatus = require("http-status");

class AuthenticationError extends Error
{
    constructor (message)
    {
        super(message);
        this.name = "AuthenticationError";
        this.status = HttpStatus.UNAUTHORIZED
    }
}

module.exports = AuthenticationError;