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

function mongoObjId(id) {
  if (id) {
    try {
      return mongo.ObjectID(id);
    } catch { /* wasn't valid mongo object ID */ }
  }
  return id;
};

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
  const _id = mongoObjId(songData._id);
  delete(songData._id);
  const coll = (await db).collection('songs')
  const prm = (_id)
    ? (newData) => coll.replaceOne({ _id }, newData)
    : (newData) => coll.insertOne(newData);
  return prm(songData)
    .catch((err) => {
      console.log(`Error adding to 'songs' collection: ${err.stack}`);
      throw err;
    });
}

async function deleteSong(songData) {
  if (!songData._id) { throw Error('_id missing'); }
  const _id = mongoObjId(songData._id);
  return (await db).collection('songs')
    .deleteOne({ _id })
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

async function addVoter(voterData) {
  if (!voterData.scoresId) { throw Error('scoresId missing'); }
  if (!voterData.name) { throw Error('name missing'); }
  voterData._id = mongoObjId(voterData._id);
  const coll = (await db).collection('voters');
  const prm = (voterData._id) 
    ? (newData) => coll.replaceOne({ _id: voterData._id }, newData)
    : (newData) => coll.insertOne(newData);
  return prm(voterData)
    .catch((err) => {
      console.log(`Error adding to 'voters' collection: ${err.stack}`);
      throw err;
    });
}

async function deleteVoter(voterData) {
  if (!voterData._id) { throw Error('_id missing'); }
  if (!voterData.scoresId) { throw Error('scoresId missing'); }
  const voters = (await db).collection('voters');
  const scores = (await db).collection('scores');
  const _id = mongoObjId(voterData._id);
  try {
    await voters.deleteOne({ _id });
    await scores.deleteOne({
      scoresId: voterData.scoresId,
      voterId: _id,
    });
  } catch(err) {
    console.log(`Error deleting from 'voters' collection: ${err.stack}`);
    throw err;
  }
}

async function setActiveVoter(activeVoterData) {
  if (!activeVoterData.scoresId) { throw Error('scoresId missing'); }
  if (!activeVoterData.activeVoterId) { throw Error('activeVoterId missing'); }
  activeVoterData.activeVoterId = mongoObjId(activeVoterData.activeVoterId);
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

async function getActiveVoter(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('activeVoter')
    .findOne({ scoresId })
    .catch((err) => {
      console.log(`Error in findOne from 'activeVoter' collection: ${err.stack}`);
      throw err;
    });
};

async function submitScores(scoresData) {
  if (!scoresData.scoresId) { throw Error('scoresId missing'); }
  if (!scoresData.voterId) { throw Error('voterId missing'); }
  if (!scoresData.scores) { throw Error('scores missing'); }
  scoresData.voterId = mongoObjId(scoresData.voterId);
  scoresData.scores.forEach((s) => {
    s.songId = mongoObjId(s.songId);
  });
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

async function getScores(scoresId, voterId = null) {
  if (!scoresId) { throw Error('scoresId missing'); }
  const findQuery = { scoresId };
  if (voterId) {
    findQuery.voterId = mongoObjId(voterId);
  }
  const coll = (await db).collection('scores')
  const prm = (voterId)
    ? () => coll.findOne(findQuery)
    : () => coll.find(findQuery).toArray();
  return prm()
    .catch((err) => {
      console.log(`Error in findOne from 'scores' collection: ${err.stack}`);
      throw err;
    });
}

async function getScoresTotal(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  const scoresPipeline = [
    { $unwind: '$scores' },
    { 
      $lookup: {
        from: 'activeVoter',
        localField: 'voterId',
        foreignField: 'activeVoterId',
        as: 'activeVoter', 
      }
    },
    {
      $unwind: {
        path: '$activeVoter',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $set: {
        'scores.activeScore': {
          $cond: [
            '$activeVoter._id',
            '$scores.score',
            0,
          ],
        },
      }
    },
    {
      $group: {
        _id: '$scores.songId',
        totalScore: { $sum: '$scores.score' },
        activeScore: { $sum: '$scores.activeScore' },
      },
    },
    {
      $match: {
        $expr: {
          $eq: [ '$_id', '$$songId' ],
        },
      },
    },
  ];
  const queryPipeline = [
    {
      $match: {
        scoresId,
      },
    },
    {
      $lookup: {
        from: 'scores',
        let: { 
          songId: '$_id',
        },
        pipeline: scoresPipeline,
        as: 'scores',
      },
    },
    {
      $unwind: {
        path: '$scores',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $set: {
        totalScore: { $ifNull: [ '$scores.totalScore', 0 ] },
        activeScore: { $ifNull: [ '$scores.activeScore', 0 ] },
      },
    },
    { $sort: { country: 1, year: -1 } },
    {
      $project: {
        _id: 1,
        country: 1,
        year: 1,
        titleEnglish: 1,
        titleLocal: 1,
        performingArtist: 1,
        credits: 1,
        chosenBy: 1,
        totalScore: 1,
        activeScore: 1,
      },
    },
  ];
  return (await db).collection('songs')
    .aggregate(queryPipeline)
    .toArray()
    .catch((err) => {
      console.log(`Error in aggregate: ${err.stack}`);
      throw err;
    });
}

module.exports = {
  createContest,
  getContest,
  getSongs,
  addSong,
  deleteSong,
  getVoters,
  addVoter,
  deleteVoter,
  setActiveVoter,
  getActiveVoter,
  submitScores,
  getScores,
  getScoresTotal,
};
