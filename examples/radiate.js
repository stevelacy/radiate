'use strict';

const fs = require('fs');

module.exports = function(r) {

  // Set config values

  // String, value
  r.set('env', 'development');
  // => r.config.env == 'development'

  // String, true
  r.set('devops');
  // => r.config.devops == true

  // String, Object
  r.set('development-server', {
    host: '127.0.0.1',
    user: 'root',
    key: fs.readFileSync('/home/root/.ssh/id_rsa'),
    source: ['./*'],
    destination: '/tmp/',
    shell: 'ssh -i /home/root/.ssh/id_rsa -oIdentitiesOnly=yes -oStrictHostKeyChecking=no',
    flags: 'avz',
  });


    // Execute a function task
    r.exec(function() {
      // Optional wrapper for functions in a task
      // Ex:
      fs.mkdirSync('test');
    });

    // Execute a shell command on the local machine with options
    r.exec('ls', ['-al']);

    // deploy (push) code to a remote server
    // You must set the config for the server prior to the `deploy` command
    // this will use the config set in `r.set('<server name>', {})`
    // Ex: `r.set('development-server', {host: '127.0.0.1'})`
    r.deploy('development-server');

  // Run commands on the remote server
  // Also requires the config set in `r.set('<server name>', {})`
  r.remote('development-server', 'ls -al /tmp', function() {
    // do stuff
  });

};
