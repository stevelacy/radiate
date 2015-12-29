#!/usr/bin/env node

'use strict';

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const log = require('../lib/log');
const Radiate = require('..');

const Initiate = new Liftoff({
  name: 'radiate',
  extensions: {
    '.js': null,
    '.coffee': 'coffee-script/register'
  },
  v8flags: ['--harmony'],
  configName: 'radiate'
});

Initiate.launch({
  cwd: argv.cwd,
  configPath: argv.radiate,
  require: argv.require
}, invoke);

function invoke (env) {
  let moduleConfig;
  let handler = new Radiate();

  try {
    moduleConfig = require(env.configPath);
  } catch (e) {
    if (e.message === 'missing path') {
      return log.error('Could not find a radiate.js file')
    }
    return log.error(e);
  }

  if (argv._[0]) {
    try {
      argv._.forEach(function(key, value) {
        if (typeof moduleConfig[key] !== 'function') {
          return log.error('Error: task "' + key + '" is invalid');
        }
        moduleConfig[key](handler);
      });
    } catch (e) {
      log.error(e);
    } finally {
      return;
    }
    return;
  }

  if (typeof moduleConfig !== 'function') {
    return log.error('Error: are you exporting a function or did you forget to call the task name?');
  }

  moduleConfig(handler);
}
