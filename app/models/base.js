class BaseModel
{
    constructor (params) 
    {
        if (params._id)
        {
            this._id = params._id;
        }
    }

    get id ()
    {
        return this._id;
    }

    static get DataModel ()
    {
        var err  = new Error("Extend BaseModel and set DataModel");
        throw err;
    }

    create () 
    {   
        var DataModel = this.constructor.DataModel;
        return new DataModel(this).save()
        .then((doc) => { this._id = doc._id; })
        .then(() => Promise.resolve(this));
    }

    update (updates) 
    {
        var DataModel = this.constructor.DataModel;
        return DataModel.findAndModify({ _id: this.id }, updates);
    }

    remove () 
    {
        var DataModel = this.constructor.DataModel;
        return DataModel.remove({ _id: this.id });
    }

    static findAll (query, populate) 
    {
        var DataModel = this.DataModel;
        var promise = DataModel.find(query);
        if (populate) promise = promise.populate(populate);
        
        return promise.then((docs) => docs.map(
            (doc) => new this(doc)
        ));
    }
    static findOne (query, populate) 
    {
        var DataModel = this.DataModel;

        var promise = DataModel.findOne(query);
        if (populate) promise = promise.populate(populate);

        return promise.then((doc) => 
        {
            if (!doc)
            {
                var err = new Error("Not Found.");
                err.name = "NotFoundError";
                err.status = 404;
                throw err;
            }
            else 
            {
                return new this(doc);
            }
        });
    }
}

module.exports = BaseModel;