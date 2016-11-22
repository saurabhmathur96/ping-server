var path = require("path");
var logger = require("morgan");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

var dotenv = require("dotenv");
dotenv.load({ silent: true });

var HttpStatus = require("http-status");

var Database = require(path.join(__dirname, "app", "data", "database"));
var db = new Database(process.env.MONGO_URI);

var AuthenticationManager = require(path.join(__dirname, "app", "authentication", "manager"));
var secret = process.env.SECRET;
var authenticationManager = new AuthenticationManager(db, secret);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("short"));

var routes = require(path.join(__dirname, "app", "controllers", "index"));
app.use("/api/v1", routes(db, authenticationManager));

//
// Catch Errors

// handle 404
app.use((req, res, next) =>
{
    var err = new Error("Not Found.");
    err.name = "NotFoundError";
    err.status = HttpStatus.NOT_FOUND;
    next(err);
});


// handle other errors
var debugging = process.env.DEBUGGING && process.env.DEBUGGING == 1;
app.use((err, req, res, next) =>
{
    // Mongoose validation errors
    err.validationErrors = {};
    if (err.name === "ValidationError")
    {
        err.validationErrors = {};
        for (var field in err.errors) 
        {
            err.validationErrors[field] = {};
            err.validationErrors[field].type = err.errors[field].type;
            err.validationErrors[field].message = err.errors[field].message;
        }
        err.status = HttpStatus.BAD_REQUEST;
    }

    // Duplicate key error
    else if (err.name === "MongoError" && err.code === 11000)
    {
        err.name = "DuplicateError"
        err.message = "record already exists.";
        err.status = HttpStatus.BAD_REQUEST;
    }

    var status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status);

    var response = {};
    response.error = err.name || "InternalServerError";
    response.message = err.message;
    response.validationErrors = err.validationErrors;

    if (debugging)
    {
        response.stack = err.stack;
    }
    

    res.json(response);
});

var port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;