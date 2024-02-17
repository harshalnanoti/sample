const winston = require('winston');

// Set up winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add other transports as needed, such as file-based logging
  ],
});

module.exports = logger;
