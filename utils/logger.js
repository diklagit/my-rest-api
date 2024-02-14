const fs = require('fs');
const path = require('path');
const { chalkLogErr, chalkLogComplete } = require('./chalk');

const logger = (req, res, next) => {
  // Ensure the logs directory exists
  // isLogsDirectoryExist();

  // Capture the original response.send function
  const originalSend = res.send;

  // Override response.send function
  res.send = function (body) {
    if (res.statusCode >= 400) {
      const logFilePath = path.join(
        appRoot,
        'logs',
        `${getCurrentDate()}.log`
      );
      const logMessage = `[${new Date().toISOString()}] ${
        res.statusCode
      }: ${body}\n`;

      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
          chalkLogErr('Error writing to log file:', err);
        }
      });
    }

    // Call the original response.send function
    originalSend.call(this, body);
  };

  next();
};

// Function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function isLogsDirectoryExist() {
  const logsDir = path.join(appRoot, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    chalkLogComplete('Logs directory created');
  }
}

// function isFileExist() {
//   if (!fs.existsSync(`${__dirname}/../logs`)) {
//     chalkLogDanger('Creating logs directory');
//     fs.mkdirSync(`${__dirname}/../logs`);
//   }
//   chalkLogComplete('file was checked.');
// }

module.exports = { logger, isLogsDirectoryExist };
