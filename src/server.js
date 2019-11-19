require("babel-core/register");
const dataAccess = require('./data-access');

dataAccess.connect('test', (db) => {
  dataAccess.findDocuments(db, 'player');
})