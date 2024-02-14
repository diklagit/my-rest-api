const { mongo } = require('../configs/config');
const mongoose = require('mongoose');
const {
  chalkLogErr,
  chalkLogComplete,
  chalkLogProcess,
} = require('../utils/chalk');

async function connect() {
  const uri = `${mongo.uri}${mongo.uri.at(-1) === '/' ? '' : '/'}${
    mongo.dbName
  }`;
  chalkLogProcess(`Connecting to db: ${uri}`);

  return mongoose
    .connect(uri)
    .then(() => chalkLogComplete('Connected to db'))
    .catch((err) => chalkLogErr('Could not connect to db', err.message));
}

module.exports = { connect };
