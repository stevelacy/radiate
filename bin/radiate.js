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
  const moduleConfig = require(env.configPath);
  let handler = new Radiate();

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
