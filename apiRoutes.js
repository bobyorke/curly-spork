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
  console.log(`body: ${JSON.stringify(req.body, null, 2)}`);
  db.createContest(req.body.sid, req.body.uuid)
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

router.post('/put/:scoresId/:dataType', (req, res) => {
  db.put(req.params.scoresId, req.params.dataType, req.body)
    .then(() => { res.send('OK'); })
    .catch((err) => { res.status(500).send(`Error writing to database: ${err}`); });
});

router.get('/get/:scoresId/:dataType', (req, res) => {
  db.get(req.params.scoresId, req.params.dataType)
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).send(`Error reading from database: ${err}`); });
});

module.exports = router;
