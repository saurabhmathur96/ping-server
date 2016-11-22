var bcrypt = require("bcrypt");

class User
{
    constructor (params)
    {
        if (params._id)
        {
            this._id = params._id;
        }
        this.username = params.username;
        this.password = params.password;
        this.topics = params.topics || []; // Array of group ids.
    }

    get id ()
    {
        return this._id;
    }


    hashPassword ()
    {
        var deferred = Promise.defer();
        var saltWorkFactor = process.env.SALT_WORK_FACTOR || 10;
        bcrypt.hash(this.password, saltWorkFactor, (err, hashed) =>
        {
            if (err) return deferred.reject(err);

            this.password = hashed;
            deferred.resolve(this);
        });
        return deferred.promise;
    }

    validatePassword(password)
    {
        var deferred = Promise.defer();

        bcrypt.compare(password, this.password, (err, valid) =>
        {
            if (err) return deferred.reject(err);

            deferred.resolve(valid);
        });

        return deferred.promise;
    }
    
}

module.exports = User;