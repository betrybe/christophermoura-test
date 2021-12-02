require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_REMOTE_URL = 'mongodb://mongodb:27017/Cookmaster';
const DB_NAME = 'Cookmaster';
const MONGO_DB_URL = process.env.MONGO_LOCAL_URL || MONGO_REMOTE_URL;

const connection = () => (
    MongoClient.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
      .then((conn) => conn.db(DB_NAME))
      .catch((err) => {
          console.log(err);
          process.exit(1);
        })
);

module.exports = connection;
