require('./configs/loadEnvs');
const path = require('node:path');
global.appRoot = path.resolve(__dirname);

const { seed } = require('./initialData/initialDataService');
const { logger, isLogsDirectoryExist } = require('./utils/logger');

const express = require('express');
const morgan = require('morgan');

const { chalkLogComplete } = require('./utils/chalk');
const config = require('./configs/config');

const app = express();
app.use(require('cors')());
app.use((req, res, next) => logger(req, res, next));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', require('./routes/users.routes'));
app.use('/api/users/login', require('./routes/auth.routes'));
app.use('/api/cards', require('./routes/cards.routes'));

app.all('*', (req, res) => {
  res
    .status(404)
    .sendFile(path.resolve(__dirname, './static/public/pageNotFound.html'));
});

require('./db/dbService')
  .connect()
  .then(() => isLogsDirectoryExist())
  .then(() => seed().catch(() => {}))
  .then(() => {
    app.listen(config.app.port, () => {
      chalkLogComplete(`listening on port: ${config.app.port}`);
    });
  });
