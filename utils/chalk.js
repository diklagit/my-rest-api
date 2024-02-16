const chalk = require('chalk');

const chalkLogErr = function (message, log) {
  return console.log(chalk.bold.red(message, log));
};

const chalkLogDanger = function (message, log) {
  return console.log(chalk.hex('#FFA500')(message, log));
};

const chalkLogRegisteredUser = function (message, log) {
  return console.log(chalk.bgMagenta(message, log));
};

const chalkLogSignedUser = function (message, log) {
  return console.log(chalk.inverse.bold(message, log));
};

const chalkLogUnBlockedUser = function (message, log) {
  return console.log(chalk.bgGreen(message, log));
};

const chalkLogComplete = function (message, log) {
  return console.log(chalk.green(message, log));
};

const chalkLogProcess = function (message, log) {
  return console.log(chalk.blue(message, log));
};

const chalkLogAttempts = function (message, log) {
  return console.log(chalk.bgRed(message, log));
};

module.exports = {
  chalkLogErr,
  chalkLogDanger,
  chalkLogRegisteredUser,
  chalkLogSignedUser,
  chalkLogUnBlockedUser,
  chalkLogComplete,
  chalkLogProcess,
  chalkLogAttempts,
};
