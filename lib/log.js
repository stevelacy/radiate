'use strict';
const chalk = require('chalk');
const format = require('util').format;
const PROJECT_NAME = require('../package.json').name;

let log = function() {
  console.log(chalk.cyan('[' +PROJECT_NAME+ ']'), chalk.green(format.apply(null, arguments)));
};

log.error = function() {
  console.log(chalk.cyan('[' +PROJECT_NAME+ ']'), chalk.red(format.apply(null, arguments)));
}

log.raw = function() {
  console.log(format.apply(null, arguments));
}

module.exports = log;
