const config = require('../../config.json');
const { MongoClient, ObjectId } = require('mongodb');

export const getAllCollections = function (db, callback) {
    if (!db) {
        if (callback) {
            callback({ error: 'Database cannot be null.' });
        }
        return;
    }
    db.listCollections().toArray((err, collections) => {
        if (callback) {
            callback(err, collections || []);
        }
    });
}
export const findDocuments = function (db, collectionName, filter, pageSize, skip, sort, callback) {
    if (!db) {
        if (callback) {
            callback({ error: 'Database cannot be null.' });
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
        .toArray((err, docs) => {
            if (callback) {
                callback(err, docs);
            }
        });
}

export const findDocument = function (db, collectionName, id, callback) {
    if (!ObjectId.isValid(id)) {
        if (callback) {
            callback(`Id '${id}' is not valid.`);
        }
        return;
    }

    const filter = { _id: new ObjectId(id) };
    findDocuments(db, collectionName, filter, 1, 0, {}, (err, documents) => {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        if (documents && documents.length) {
            if (callback) {
                callback(null, documents[0]);
            }
        } else {
            if (callback) {
                callback(null, null);
            }
        }
    })
}

export const connect = function (configName, callback) {
    let dbConfig = null;

    if (config['mongodb'] && config['mongodb'][configName]) {
        dbConfig = config['mongodb'][configName];
    }

    if (!dbConfig) {
        if (callback) {
            callback({ error: `Config '${configName}' is not set.` });
        }
        return;
    }

    const url = dbConfig.url;
    const dbName = dbConfig.dbName;
    const client = new MongoClient(url);
    client.connect(function (err) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        const db = client.db(dbName);

        if (callback) {
            callback(null, db);
        }

        client.close();
    });
};

export const getAllConfigs = function () {
    let dbConfigs = [];

    if (config['mongodb']) {
        for (let [configName, _] of Object.entries(config['mongodb'])) {
            dbConfigs.push(configName);
        }
    }

    return dbConfigs;
}