const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');

const apiRoutes = require('./apiRoutes.js');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/', apiRoutes);
app.use('/scoresApi/', apiRoutes);

app.use('/scores', express.static(path.join(__dirname, 'dist')));

const port = process.env.HTTP_PORT || 8081;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

