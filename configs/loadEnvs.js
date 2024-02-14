const path = require('node:path');
const { chalkLogProcess } = require('../utils/chalk');

const envPath = path.resolve(__dirname, `../${`.env.${process.env.NODE_ENV}`}`);

chalkLogProcess('loading environment variables from: ', envPath);

require('dotenv').config({
  path: envPath,
});
