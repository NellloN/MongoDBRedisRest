const mongodbDataAccess = require('./data-access');
const express = require('express');
const router = express.Router();

router.get('/:configName/:collection/:id', (req, res) => {
    const configName = req.params.configName;
    const collection = req.params.collection;
    const id = req.params.id;

    mongodbDataAccess.connect(configName, (db) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.error(err);
            return;
        }
        mongodbDataAccess.findDocument(db, collection, id, (document) => {
            if (err) {
                res.status(400);
                res.send(err);
                console.error(err);
                return;
            }

            if (!document) {
                res.status(404);
                const message = `Document with id ${id} not found.`;
                res.send(message);
                console.warn(message);
                return;
            }

            res.send(document);
        });
    });
});

router.get('/:configName/:collection', function (req, res) {
    const configName = req.params.configName;
    const collection = req.params.collection;
    const filter = JSON.parse(req.query.filter || "{}");
    const pageSize = +req.query.pageSize;
    const skip = +req.query.skip;
    const sort = JSON.parse(req.query.sort || "{}");

    mongodbDataAccess.connect(configName, (err, db) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.error(err);
            return;
        }
        mongodbDataAccess.findDocuments(db, collection, filter, pageSize, skip, sort, (err, documents) => {
            if (err) {
                res.status(400);
                res.send(err);
                console.error(err);
                return;
            }

            res.send(documents);
        });
    });
});

router.get('/:configName', function (req, res) {
    const configName = req.params.configName;
    mongodbDataAccess.connect(configName, (err, db) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.error(err);
            return;
        }
        mongodbDataAccess.getAllCollections(db, (err, collections) => {
            if (err) {
                res.status(400);
                res.send(err);
                console.error(err);
                return;
            }

            const urls = collections.map(c => c.name).sort().map(cn => `<li><a href="/mongodb/${configName}/${cn}">${cn}</a></li>`);
            const html =  `<ul>${urls.join('')}</ul>`
            res.send(html);
        });
    });
});

router.get('/', (_, res) => {
    const urls = mongodbDataAccess.getAllConfigs().map(cn => `<li><a href="/mongodb/${cn}">${cn}</a></li>`);
    const html =  `<ul>${urls.join('')}</ul>`
    res.send(html);
});

module.exports = router;