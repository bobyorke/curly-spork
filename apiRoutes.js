const router = require('express').Router();

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

module.exports = router;
