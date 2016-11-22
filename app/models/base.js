class BaseModel
{
    constructor (params) 
    {
        this._id = params._id || null;
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
        var DataModel = this.DataModel;
        return new DataModel(this).save()
        .then((doc) => new this(doc));
    }

    update (updates) 
    {
        var DataModel = this.DataModel;
        return DataModel.findAndModify({ _id: this.id }, updates);
    }

    remove () 
    {
        var DataModel = this.DataModel;
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