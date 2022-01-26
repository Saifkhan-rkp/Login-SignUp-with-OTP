
const { MongoClient } = require("mongodb");
//require('dotenv').config();

//const { error } = require("winston");
const _uri = process.env.MONGODB_URL;// process.env.MONGODB_URL;


const dbCon = (coll, cb, coll2) => {
    MongoClient.connect(_uri)
        .then(async (client) => {
            const db = client.db('Assignment').collection(coll);
            let db2
            if (coll2) {
                db2 = client.db('Assignment').collection(coll2);
            }
            await cb(db, db2);
            client.close();
        }).catch(err => { console.log(err) });
};
module.exports = dbCon;



/**
 * 
 * const client = new MongoClient(_uri);
const dbCon = async (coll, cb, coll2) => {
    try {
        await client.connect()
        const db = client.db('Assignment').collection(coll);
        let db2
        if (coll2) {
            db2 = client.db('Assignment').collection(coll2);
        }
        await cb(db, db2);

    } finally {
        await client.close();
    }
    // .catch (err => console.log(err))
    // .finally(() => {  });

};

 */