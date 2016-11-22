class NewsItemController
{
    constructor (db) 
    {
       this.db = db;
    }

    fetchItems(req, res, next)
    {
        var query = {};

        this.db.NewsItem.findAll(query)
        .then((items) => res.json({ items: items }))
        .catch(next);
    }

    addItem (req, res, next)
    {
        var item = new this.db.NewsItem({
            title: req.body.title,
            text: req.body.text,
            createdBy: req.user.id
        });

        item.create()
        .then((item) => res.status(201).json({ item: item }))
        .catch(next);
    }

    fetchItemById (req, res, next)
    {
        this.db.NewsItem.findById(req.params.itemid)
        .then((item) => res.json({ item: item }))
        .catch(next);
    }

}

module.exports = NewsItemController;