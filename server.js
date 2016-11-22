var path = require("path");
var logger = require("morgan");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

var dotenv = require("dotenv");
dotenv.load({ silent: true });

var Database = require(path.join(__dirname, "app", "models", "database"));
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
    err.status = 404;
    next(err);
});


// handle other errors
var debugging = process.env.DEBUGGING && process.env.DEBUGGING == 1;
app.use((err, req, res, next) =>
{
    var status = err.status || 500;
    res.status(status);

    var response = {};
    response.error = err.name || "InternalServerError";
    response.message = err.message;
    if (debugging)
    {
        response.stack = err.stack;
    }
    response.validationErrors = {};

    if (err.name === "ValidationError")
    {
        for (field in err.errors) 
        {
            response.errors[field] = {};
            response.errors[field].type = err.errors[field].type;
            response.errors[field].message = err.errors[field].message;
        }
    }

    res.json(response);
});

var port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;