const config = require('../config.json');
const { MongoClient, ObjectId } = require('mongodb');
const assert = require('assert');

export const findDocuments = function (db, collectionName, filter, pageSize, skip, sort, callback) {
    if (!db) {
        if (callback) {
            callback();
        }
        return;
    }

    filter = filter || {};
    pageSize = pageSize || 50;
    skip = skip || 0;
    sort = sort || {};

    const collection = db.collection(collectionName);
    collection
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .sort(sort)
        .toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs);

            if (callback) {
                callback(docs);
            }
        });
}

export const findDocument = function (db, collectionName, id, filter, pageSize, skip, sort, callback) {
    if (!db) {
        if (callback) {
            callback();
        }
        return;
    }

    if (!ObjectId.isValid(id)) {
        if (callback) {
            callback();
        }
        return;
    }

    filter = filter || {};
    pageSize = pageSize || 50;
    skip = skip || 0;
    sort = sort || {};

    const collection = db.collection(collectionName);
    const mongoId = new ObjectId(id);
    collection
        .find({ _id: mongoId })
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .sort(sort)
        .toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs);

            if (callback) {
                if (docs) {
                    callback(docs[0]);
                } else {
                    callback();
                }
            }
        });
}

export const connect = function (configName, callback) {
    const dbConfig = config['mongodb'][configName];

    if (!dbConfig) {
        if (callback) {
            callback();
        }
        return;
    }

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