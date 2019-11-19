require("babel-core/register");
const express = require('express');
const app = express();
const dataAccess = require('./data-access');
const config = require('../config.json');

app.use(function (error, req, res, next) {
  console.log(req);
  next();
});
app.get('/:configName/:collection/:id?', function (req, res) {
  const configName = req.params.configName;
  const collection = req.params.collection;
  const id = req.params.id;
  const filter = JSON.parse(req.query.filter || "{}");
  const pageSize = +req.query.pageSize;
  const skip = +req.query.skip;
  const sort = JSON.parse(req.query.sort || "{}");

  dataAccess.connect(configName, (db) => {
    if (id) {
      dataAccess.findDocument(db, collection, id, (document) => {
        if (document) {
          res.send(document);
        } else {
          res.status(404);
          res.send(`Document with id ${id} not found.`);
        }
      });
    } else {
      dataAccess.findDocuments(db, collection, filter, pageSize, skip, sort, (documents) => {
        if (documents) {
          res.send(documents);
        } else {
          res.status(404);
          res.send(`Documents not found.`);
        }
      });
    }
  });
});

app.listen(config.port, function () {
  console.log(`Example app listening on port ${config.port}!`);
});