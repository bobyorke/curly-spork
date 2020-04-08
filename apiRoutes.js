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

router.post('/put/:scoresId/:dataType', (req, res) => {
  db.put(req.params.scoresId, req.params.dataType, req.body)
    .then(
});

module.exports = router;
