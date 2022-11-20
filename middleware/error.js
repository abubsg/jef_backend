const logger = require("../startup/logging");
module.exports = function (error, req, res, next) {
  logger.error(error.message, error);

  res.status(500).send("Something Failed.");
};
