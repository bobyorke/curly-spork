const router = require('express').Router();
const db = require('./controllers/db');

router.get('/', (req, res) => {
  res.send('API initialised');
});

router.get('/test', (req, res) => {
  const names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  res.json(
    Object.fromEntries(
      names.map((x) => [x, Math.floor(Math.random() * 100)]),
    ),
  );
});

router.post('/create', (req, res) => {
  db.createContest(req.body.sid, req.body.uuid, req.body.scoresOptions)
    .then(() => { 
      res.json({
        status: 'ok',
      });
    })
    .catch((err) => {
      console.log(`Error creating contest: ${err.stack}`);
      res.status(500).send(`Error creating contest: ${err.message}`);
    });
});

router.get('/getContest/:uuid', (req, res) => {
  db.getContest(req.params.uuid)
    .then((result) => {
      if (result) { res.json(result); }
      else { res.status(404).send(`No conteest found for ${req.params.uuid}`); }
    })
    .catch((err) => {
      console.log(`Error getting contest: ${err.stack}`);
      res.status(500).send(`Error getting contest: ${err.message}`);
    });
});

router.get('/getSongs/:scoresId', (req, res) => {
  db.getSongs(req.params.scoresId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting songs: ${err.stack}`);
      res.status(500).send(`Error getting songs: ${err.message}`);
    });
});

router.post('/addSong', (req, res) => {
  db.addSong(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error adding song: ${err.message}`); });
});

router.post('/deleteSong', (req, res) => {
  db.deleteSong(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error deleting song: ${err.message}`); });
});

router.get('/getVoters/:scoresId', (req, res) => {
  db.getVoters(req.params.scoresId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting voters: ${err.stack}`);
      res.status(500).send(`Error getting voters: ${err.message}`);
    });
});

router.post('/addVoter', (req, res) => {
  db.addVoter(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error adding voter: ${err.message}`); });
});

router.post('/deleteVoter', (req, res) => {
  db.deleteVoter(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error deleting voter: ${err.message}`); });
});

router.get('/getActiveVoter/:scoresId', (req, res) => {
  db.getActiveVoter(req.params.scoresId)
    .then((result) => { res.json(result); })
    .catch((err) => { res.status(500).send(`Error getting active voter: ${err.message}`); });
});

router.post('/setActiveVoter', (req, res) => {
  db.setActiveVoter(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error setting active voter: ${err.message}`); });
});

router.post('/submitScores', (req, res) => {
  db.submitScores(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error submitting scores: ${err.message}`); });
});

router.get('/getScores/:scoresId/:voterId', (req, res) => {
  db.getScores(req.params.scoresId, req.params.voterId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting scores: ${err.stack}`);
      res.status(500).send(`Error getting scores: ${err.message}`);
    });
});

router.get('/getScoresTotal/:scoresId', (req, res) => {
  db.getScoresTotal(req.params.scoresId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting scores: ${err.stack}`);
      res.status(500).send(`Error getting scores: ${err.message}`);
    });
});

router.use((req, res) => {
  res.status(404).type('txt').send('404 - Not found');
});

module.exports = router;
