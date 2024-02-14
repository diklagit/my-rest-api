require('./configs/loadEnvs');
const path = require('node:path');
global.appRoot = path.resolve(__dirname);

const { seed } = require('./initialData/initialDataService');
const { logger, isLogsDirectoryExist } = require('./utils/logger');

// require('dotenv/config');

// const mongoose = require('mongoose');

// mongoose
//   .connect(
//     ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@my-rest-api-proj.2s8ytix.mongodb.net/my_rest_api`
//   )

//   .then(() => console.log('connected to db'))
//   .catch((err) => console.log('could not connect to db', err));

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

//chalk :

// const log = console.log;

// // Combine styled and normal strings
// log(chalk.blue('Hello') + ' World' + chalk.red('!'));

// // Compose multiple styles using the chainable API
// log(chalk.blue.bgRed.bold('Hello world!'));

// // Pass in multiple arguments
// log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// // Nest styles
// log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// // Nest styles of the same type even (color, underline, background)
// log(
//   chalk.green(
//     'I am a green line ' +
//       chalk.blue.underline.bold('with a blue substring') +
//       ' that becomes green again!'
//   )
// );
