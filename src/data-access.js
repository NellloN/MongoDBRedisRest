const config = require('../config.json');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const findDocuments = function (db, collectionName, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);

        if (callback) {
            callback(docs);
        }
    });
}

const connect = function (configName, callback) {
    const dbConfig = config['mongodb'][configName];

    // Connection URL
    const url = dbConfig.url;

    // Database Name
    const dbName = dbConfig.dbName;

    // Create a new MongoClient
    const client = new MongoClient(url);

    // Use connect method to connect to the Server
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        if (callback) {
            callback(db);
        }

        client.close();
    });
};

export {findDocuments, connect};