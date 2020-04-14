const mongo = require('mongodb')
const mongoClient = mongo.MongoClient;

const config = require('../config.json');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'coronavision';

const db = mongoClient.connect(mongoUrl, config.mongoOptions)
  .then((cli) => cli.db(dbName))
  .catch((err) => {
    console.log(`Error connecting to database: ${err.stack}`);
    process.exit(1);
  });

async function put(scoresId, dataType, objData) {
  objData.scoresId = scoresId;
  objData.dataType = dataType;
  (await db).collection('scores')
    .replaceOne({ scoresId, dataType }, objData, { upsert: true })
    .catch((err) => {
      console.log(`Error inserting object: ${err.stack}`);
      throw(err);
    });
} 

async function get(scoresId) {
  return (await db).collection('scores')
    .find({ scoresId })
    .catch((err) => {
      console.log(`Error getting data from DB: ${err.stack}`);
      throw(err);
    });
}

async function createContest(scoresId, adminUuid, scoresOptions = config.defaultScoresOptions) {
  if (!scoresId) { throw Error('scoresId missing'); }
  if (!adminUuid) { throw Error('adminUuid missing'); }
  const scoresOpts = (typeof scoresOptions === 'string')
    ? scoresOptions.split(/[\s,]+/)
    : scoresOptions;
  return (await db).collection('contests')
    .insertOne({
      scoresId,
      adminUuid,
      scoresOptions,
      creationDate: new Date(),
    })
      .catch((err) => {
        console.log(`Error inserting into 'contests' collection: ${err.errmsg}`);
        if (err.code == 11000) {
          throw Error(`${scoresId} already exists.`);
        } else {
          throw Error(err.errmsg);
        }
      });
}

async function getContest(adminUuid) {
  if (!adminUuid) { throw Error('adminUuid missing'); }
  return (await db).collection('contests')
    .findOne({ adminUuid })
    .catch((err) => {
      console.log(`Error in findOne from 'contests' collection: ${err.errmsg}`);
      throw err;
    });
}

module.exports = {
  put,
  get, 
  createContest,
  getContest,
};
