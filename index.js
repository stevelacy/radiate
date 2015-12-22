'use strict';

const spawn = require('child_process').spawn;
const Rsync = require('rsync');
const SSH = require('simple-ssh');
const log = require('./lib/log');

class Radiate {

  set (name, value) {
    if (!this.config) {
      this.config = {};
    }
    if (!value) {
      this.config[name] = true;
      return;
    }
    this.config[name] = value;
  }

  exec (fn, opts, cb) {

    if (typeof opts === 'function') {
      cb = opts;
      opts = [];
    }
    if (!opts) {
      opts = [];
    }

    if (!cb) cb = function(){};

    if (typeof fn === 'string') {
      return this.spawnCmd(fn, opts, cb);
    }

    log('Starting');

    fn(this);
  }

  spawnCmd (cmd, opts, cb) {

    log('Starting');

    let run = spawn(cmd, opts);
    run.stdout.on('data', (data) => {
      log(String(data));
    });

    run.stderr.on('data', (data) => {
      log(String(data));
    });

    run.on('close', (code) => {
      if (code === 0) return cb();
      process.exit(code);
    });
  }

  deploy (name, opts, cb) {
    var server = this.config[name];
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    if (!cb) cb = function(){};

    log(name, 'Starting deploy');

    if (!server) {
      log.error('deploy','Option: ' + name + ' not set in config');
      log.error('deploy', 'Use radiate.set("String", {Object}) to set config values');
      return;
    }

    let host = server.user + '@' + server.host + ':' + server.destination;
    server.destination = host;

    let rsync = Rsync.build(server);

    rsync.execute((err, stdout, stderr) => {
      if (err) log.error(err, stdout, stderr);
      log.raw(String(stdout));
      cb();
    }, function(stdout) {
      log.raw(String(stdout));
    }, function(stderr) {
      log.error(String(stderr));
    });
  }

  remote (name, opts, cb) {
    let server = this.config[name];

    if (typeof opts === 'string') {
      opts = {
        cmd: opts
      };
    }

    log(name, 'Starting remote command', opts.cmd);

    if (!cb) cb = function(){};

    if (!server) {
      log.error('deploy','Option: ' + name + ' not set in config');
      log.error('deploy', 'Use radiate.set("String", {Object}) to set config values');
      return;
    }

    let ssh = new SSH(server);
    ssh.exec(opts.cmd, {
      out: (data) => {
        log.raw(data);
        cb();
      },
      err: (data) => {
        log.error(data);
        cb();
      }
    }).start();
  }

}

module.exports = Radiate;
