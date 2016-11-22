var path = require("path");
var mongoose = require("mongoose");
var BaseModel = require(path.join(__dirname, "base"));

var NewsItemSchema = new mongoose.Schema({
    title: { type: String, required: "title is required." },
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

var NewsItemDocument = mongoose.model("NewsItem", NewsItemSchema);

class NewsItem extends BaseModel
{
    constructor (params)
    {
        super(params);
        this.title = params.title;
        this.text = params.text;
        this.createdBy = params.createdBy;
    }

    static get DataModel ()
    {
        return NewsItemDocument;
    }
    
    static findByUser (username)
    {
        return this.findAll({ "createdBy.username": username }, "createdBy.username");
    }

    static findById (id)
    {
        return this.findOne({ _id: id }, "createdBy");
    }
    
}

module.exports = NewsItem;