// Simple logger function compatible with both browser and Node.js
const logger = {
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  info: (...args) => console.info(...args),
  debug: (...args) => console.debug(...args),
};

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};

module.exports = { errorHandler, logger };