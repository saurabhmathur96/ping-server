class Topic
{
    constructor (params)
    {
        if (params._id)
        {
            this._id = params._id;
        }
        this.name = params.name;
        this.createdBy = params.createdBy; // ObjectId or User Object.
    }

    get id ()
    {
        return this._id;
    }
    
}

module.exports = Topic;