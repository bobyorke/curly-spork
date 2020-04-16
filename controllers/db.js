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
      scoresOptions: scoresOpts,
      creationDate: new Date(),
    })
      .catch((err) => {
        console.log(`Error inserting into 'contests' collection: ${err.stack}`);
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
      console.log(`Error in findOne from 'contests' collection: ${err.stack}`);
      throw err;
    });
}

async function getSongs(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('songs')
    .find({ scoresId }).toArray()
    .catch((err) => {
      console.log(`Error in find from 'songs' collection: ${err.stack}`);
      throw err;
    });
}

async function addSong(songData) {
  if (!songData.scoresId) { throw Error('scoresId missing'); }
  if (!songData.country) { throw Error('country missing'); }
  if (!songData.year) { throw Error('year missing'); }
  delete(songData._id);
  return (await db).collection('songs')
    .replaceOne(
      {
        scoresId: songData.scoresId,
        country: songData.country,
        year: songData.year,
      },
      songData,
      { upsert: true },
    )
    .catch((err) => {
      console.log(`Error adding to 'songs' collection: ${err.stack}`);
      throw err;
    });
}

async function deleteSong(songData) {
  if (!songData.scoresId) { throw Error('scoresId missing'); }
  if (!songData.country) { throw Error('country missing'); }
  if (!songData.year) { throw Error('year missing'); }
  return (await db).collection('songs')
    .deleteOne(songData)
    .catch((err) => {
      console.log(`Error deleting from 'songs' collection: ${err.stack}`);
      throw err;
    });
}

async function getVoters(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('voters')
    .find({ scoresId }).toArray()
    .catch((err) => {
      console.log(`Error in find from 'voters' collection: ${err.stack}`);
      throw err;
    });
}

async function setVoters(votersData) {
  if (!Array.isArray(votersData)) {
    throw Error('votersData must be an array');
  }
  const scoresId = votersData[0].scoresId;
  if (votersData.some((v) => v.scoresId !== scoresId)) {
    throw Error(`Add voters need the same scoresId: ${scoresId}`);
  }
  const coll = (await db).collection('voters');
  try {
    await coll.deleteMany({ scoresId });
    await coll.insert(votersData);
  } catch (err) {
    console.log(`Error in deleteMany/insert in 'voters' collection: ${err.stack}`);
    throw err;
  }
}

async function setActiveVoter(activeVoterData) {
  if (!activeVoterData.scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('activeVoter')
    .replaceOne(
      { scoresId: activeVoterData.scoresId },
      activeVoterData,
      { upsert: true },
    )
    .catch((err) => {
      console.log(`Error in replaceOne in 'activeVoter' collection: ${err.stack}`);
      throw err;
    });
}

async function submitScores(scoresData) {
  if (!scoresData.scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('scores')
    .replaceOne(
      {
        scoresId: scoresData.scoresId,
        voterId: scoresData.voterId,
      },
      scoresData,
      { upsert: true },
    )
    .catch((err) => {
      console.log(`Error in replaceOne in 'scores' collection: ${err.stack}`);
      throw err;
    });
};

module.exports = {
  createContest,
  getContest,
  getSongs,
  addSong,
  deleteSong,
  getVoters,
  setVoters,
  setActiveVoter,
  submitScores,
};
