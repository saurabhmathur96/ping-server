var HttpStatus = require("http-status");

class NotFoundError extends Error
{
    constructor (message)
    {
        super(message);
        this.name = "NotFoundError";
        this.status = HttpStatus.NOT_FOUND
    }
}

module.exports = NotFoundError;