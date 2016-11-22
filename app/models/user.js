var path = require("path");
var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var BaseModel = require(path.join(__dirname, "base"));

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: "username is required." },
    password: { type: String, required: "password is required." }
})

var UserDocument = mongoose.model("User", UserSchema);

class User extends BaseModel
{
    constructor (params)
    {
        super(params);
        this.username = params.username;
        this.password = params.password;

        
    }

    static get DataModel ()
    {
        return UserDocument;
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

    create ()
    {
        return this.hashPassword()
        .then(() => this.create());
    }

    static findByUsername (username)
    {
        return this.findOne({ username: username });
    }

    
}

module.exports = User;