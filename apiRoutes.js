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
  db.createQuiz(req.body.sid, req.body.uuid)
    .then(() => { 
      res.json({
        status: 'ok',
      });
    })
    .catch((err) => {
      console.log(`Error creating quiz: ${err.stack}`);
      res.status(500).send(`Error creating quiz: ${err.message}`);
    });
});

router.get('/getQuiz/:uuid', (req, res) => {
  db.getQuiz(req.params.uuid)
    .then((result) => {
      if (result) { res.json(result); } else { res.status(404).send(`No conteest found for ${req.params.uuid}`); }
    })
    .catch((err) => {
      console.log(`Error getting quiz: ${err.stack}`);
      res.status(500).send(`Error getting quiz: ${err.message}`);
    });
});

router.get('/getParticipants/:scoresId', (req, res) => {
  db.getParticipants(req.params.scoresId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting participants: ${err.stack}`);
      res.status(500).send(`Error getting participants: ${err.message}`);
    });
});

router.post('/addParticipant', (req, res) => {
  db.addParticipant(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error adding participant: ${err.message}`); });
});

router.post('/deleteParticipant', (req, res) => {
  db.deleteParticipant(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error deleting participant: ${err.message}`); });
});

router.get('/getRounds/:scoresId', (req, res) => {
  db.getRounds(req.params.scoresId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(`Error getting rounds: ${err.stack}`);
      res.status(500).send(`Error getting rounds: ${err.message}`);
    });
});

router.post('/addRound', (req, res) => {
  db.addRound(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error adding round: ${err.message}`); });
});

router.post('/deleteRound', (req, res) => {
  db.deleteRound(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error deleting round: ${err.message}`); });
});

router.get('/getActiveRound/:scoresId', (req, res) => {
  db.getActiveRound(req.params.scoresId)
    .then((result) => { res.json(result); })
    .catch((err) => { res.status(500).send(`Error getting active round: ${err.message}`); });
});

router.post('/setActiveRound', (req, res) => {
  db.setActiveRound(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error setting active round: ${err.message}`); });
});

router.post('/submitScores', (req, res) => {
  db.submitScores(req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error submitting scores: ${err.message}`); });
});

router.get('/getScores/:scoresId/:roundId', (req, res) => {
  db.getScores(req.params.scoresId, req.params.roundId)
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
