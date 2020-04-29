const mongo = require('mongodb')
const mongoClient = mongo.MongoClient;

const config = require('../config.json');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'zoombarquiz';

const scoresCache = {};

function clearScoresCache(scoresId) {
  console.log(`Deleting ${scoresId} from cache`);
  delete scoresCache[scoresId];
}

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

async function createQuiz(scoresId, adminUuid) {
  if (!scoresId) { throw Error('scoresId missing'); }
  if (!adminUuid) { throw Error('adminUuid missing'); }
  return (await db).collection('quizes')
    .insertOne({
      scoresId,
      adminUuid,
      creationDate: new Date(),
    })
      .catch((err) => {
        console.log(`Error inserting into 'quizes' collection: ${err.stack}`);
        if (err.code == 11000) {
          throw Error(`${scoresId} already exists.`);
        } else {
          throw Error(err.errmsg);
        }
      });
}

async function getQuiz(adminUuid) {
  if (!adminUuid) { throw Error('adminUuid missing'); }
  return (await db).collection('quizes')
    .findOne({ adminUuid })
    .catch((err) => {
      console.log(`Error in findOne from 'quizes' collection: ${err.stack}`);
      throw err;
    });
}

async function getParticipants(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('participants')
    .find({ scoresId }).toArray()
    .catch((err) => {
      console.log(`Error in find from 'participants' collection: ${err.stack}`);
      throw err;
    });
}

async function addParticipant(participantData) {
  if (!participantData.scoresId) { throw Error('scoresId missing'); }
  const _id = mongoObjId(participantData._id);
  delete(participantData._id);
  const coll = (await db).collection('participants')
  const prm = (_id)
    ? (newData) => coll.replaceOne({ _id }, newData)
    : (newData) => coll.insertOne(newData);
  return prm(participantData)
    .then(() => { clearScoresCache(participantData.scoresId); })
    .catch((err) => {
      console.log(`Error adding to 'participants' collection: ${err.stack}`);
      throw err;
    });
}

async function deleteParticipant(participantData) {
  if (!participantData._id) { throw Error('_id missing'); }
  if (!participantData.scoresId) { throw Error('scoresId missing'); }
  const _id = mongoObjId(participantData._id);
  return (await db).collection('participants')
    .deleteOne({ _id })
    .then(() => { clearScoresCache(participantData.scoresId); })
    .catch((err) => {
      console.log(`Error deleting from 'participants' collection: ${err.stack}`);
      throw err;
    });
}

async function getRounds(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('rounds')
    .find({ scoresId }).toArray()
    .catch((err) => {
      console.log(`Error in find from 'rounds' collection: ${err.stack}`);
      throw err;
    });
}

async function addRound(roundData) {
  if (!roundData.scoresId) { throw Error('scoresId missing'); }
  if (!roundData.name) { throw Error('name missing'); }
  roundData._id = mongoObjId(roundData._id);
  const coll = (await db).collection('rounds');
  const prm = (roundData._id) 
    ? (newData) => coll.replaceOne({ _id: roundData._id }, newData)
    : (newData) => coll.insertOne(newData);
  return prm(roundData)
    .catch((err) => {
      console.log(`Error adding to 'rounds' collection: ${err.stack}`);
      throw err;
    });
}

async function deleteRound(roundData) {
  if (!roundData._id) { throw Error('_id missing'); }
  if (!roundData.scoresId) { throw Error('scoresId missing'); }
  const rounds = (await db).collection('rounds');
  const scores = (await db).collection('scores');
  const _id = mongoObjId(roundData._id);
  try {
    await rounds.deleteOne({ _id });
    await scores.deleteOne({
      scoresId: roundData.scoresId,
      roundId: _id,
    });
  } catch(err) {
    console.log(`Error deleting from 'rounds' collection: ${err.stack}`);
    throw err;
  }
}

async function setActiveRound(activeRoundData) {
  if (!activeRoundData.scoresId) { throw Error('scoresId missing'); }
  activeRoundData.activeRoundId = mongoObjId(activeRoundData.activeRoundId);
  return (await db).collection('activeRound')
    .replaceOne(
      { scoresId: activeRoundData.scoresId },
      activeRoundData,
      { upsert: true },
    )
    .then(() => { clearScoresCache(activeRoundData.scoresId); })
    .catch((err) => {
      console.log(`Error in replaceOne in 'activeRound' collection: ${err.stack}`);
      throw err;
    });
}

async function getActiveRound(scoresId) {
  if (!scoresId) { throw Error('scoresId missing'); }
  return (await db).collection('activeRound')
    .findOne({ scoresId })
    .catch((err) => {
      console.log(`Error in findOne from 'activeRound' collection: ${err.stack}`);
      throw err;
    });
};

async function submitScores(scoresData) {
  if (!scoresData.scoresId) { throw Error('scoresId missing'); }
  if (!scoresData.roundId) { throw Error('roundId missing'); }
  if (!scoresData.scores) { throw Error('scores missing'); }
  scoresData.roundId = mongoObjId(scoresData.roundId);
  scoresData.scores.forEach((s) => {
    s.participantId = mongoObjId(s.participantId);
  });
  return (await db).collection('scores')
    .replaceOne(
      {
        scoresId: scoresData.scoresId,
        roundId: scoresData.roundId,
      },
      scoresData,
      { upsert: true },
    )
    .then(() => { clearScoresCache(scoresData.scoresId); })
    .catch((err) => {
      console.log(`Error in replaceOne in 'scores' collection: ${err.stack}`);
      throw err;
    });
};

async function getScores(scoresId, roundId = null) {
  if (!scoresId) { throw Error('scoresId missing'); }
  const findQuery = { scoresId };
  if (roundId) {
    findQuery.roundId = mongoObjId(roundId);
  }
  const coll = (await db).collection('scores')
  const prm = (roundId)
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
  if (scoresCache[scoresId]) {
    console.log(`Serving cached scores [${scoresId}]`);
    return scoresCache[scoresId];
  }
  const scoresPipeline = [
    { $unwind: '$scores' },
    { 
      $lookup: {
        from: 'activeRound',
        localField: 'roundId',
        foreignField: 'activeRoundId',
        as: 'activeRound', 
      }
    },
    {
      $unwind: {
        path: '$activeRound',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $set: {
        'scores.activeScore': {
          $cond: [
            '$activeRound._id',
            '$scores.score',
            0,
          ],
        },
      }
    },
    { $sort: { 'activeRound._id': -1 } },
    {
      $group: {
        _id: '$scores.participantId',
        totalScore: { $sum: '$scores.score' },
        activeScore: { $sum: '$scores.activeScore' },
        activeRoundId: { $first: '$activeRound._id' },
      },
    },
    {
      $match: {
        $expr: {
          $eq: [ '$_id', '$$participantId' ],
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
          participantId: '$_id',
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
        totalScore: '$scores.totalScore',
        activeScore: { 
          $cond: [
            { $ne: [ '$scores.activeRoundId', null ] },
            '$scores.activeScore',
            null,
          ],
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 1,
        name: 1,
        totalScore: 1,
        activeScore: 1,
      },
    },
  ];
  const rslt = (await db).collection('participants')
    .aggregate(queryPipeline)
    .toArray()
    .catch((err) => {
      console.log(`Error in aggregate: ${err.stack}`);
      throw err;
    });
  console.log(`Storing scores result in cache [${scoresId}]`);
  scoresCache[scoresId] = rslt;
  return rslt;
}

module.exports = {
  createQuiz,
  getQuiz,
  getParticipants,
  addParticipant,
  deleteParticipant,
  getRounds,
  addRound,
  deleteRound,
  setActiveRound,
  getActiveRound,
  submitScores,
  getScores,
  getScoresTotal,
};
