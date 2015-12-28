<p align="center">
<img src='logo.png' height='200px'>
</p>
# Radiate
[![Build Status](https://img.shields.io/travis/stevelacy/radiate.svg?style=flat-square)](https://travis-ci.org/stevelacy/radiate)
[![NPM version](https://img.shields.io/npm/v/radiate.svg?style=flat-square)](http://badge.fury.io/js/radiate)

> development task runner

Run devop tasks, deploy code, and run commands on local and remote machines.

## Usage

### Install

```
npm install --global radiate

```

Use the command `radiate` to run the tasks in your `radiate.js` file.

### `radiate.js` file
A radiate file exports a main function which takes one argument, the radiate instance.

```js

'use strict';

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
    source: ['./*'],
    destination: '/var/www/app',
    pass: 'test',
    flags: 'avz',
  });


  // Execute a shell command on the local machine with options
  r.exec('ls', ['-al']);

  // Execute pass through function
  r.exec(function() {
    // Any functions in a task
    // Ex:
    fs.mkdirSync('test');
  });

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

```

## CLI

Default task:
`$ radiate`
Radiate will run the main exported function by default

```js
module.exports = function(r) {
  // r.exec ...
}
```

Individual tasks:
`$ radiate deploy`
Radiate will run any task names which are exported
```js
module.exports = {
  build: function(r) {
    // r.exec('build-assets', 'gulp');
  },
  deploy: function(r) {
    // r.deploy('production');
  }
}
```




### set(String, String<opt> || Object<opt>)
This also sets the server config for the commands `deploy` and `remote`

Set a string to true
```js
r.set('name');
// => r.config.name == true

```

Set a string to a value
```js
r.set('name', 'value');
// => r.config.name == 'value'

```

Set a string to an object
```js
r.set('name', {key: 'value'});
// => r.config.name == {key: 'value'}

```

#### Setting servers for `deploy` or `remote` tasks:

[rsync](https://github.com/mattijs/node-rsync) is used to transfer the files.
[simple-ssh](https://github.com/MCluck90/simple-ssh) is used for the SSH sessions.

Example with Custom ssh keys/locations.
The param `shell` allows you to add pure SSH Rsync commands as [rsync(1)](http://linux.die.net/man/1/rsync) lists under option `--rsh` or `-e`

```js
r.set('development-server', {
  host: '127.0.0.1',
  user: 'root',
  key: fs.readFileSync('/home/root/.ssh/id_rsa'),
  source: ['./*'],
  destination: '/tmp/',
  shell: 'ssh -i /home/root/.ssh/id_rsa -oIdentitiesOnly=yes -oStrictHostKeyChecking=no',
  flags: 'avz',
});
```

Refer to their docs for more complex connection settings.



### exec(String, Array<opt>, Function<opt>)

Execute a shell command on the process machine (local)

```js
r.exec('ls', ['-al'], function () {

});
```
### deploy(String, Object<opt>, Function<opt>)

Deploy to the specified server via config
This uses the preset server config from [#set](#set)

```js
r.deploy('development-server', function(r) {

})
```


### remote(String, Object || String, Function<opt>)

Execute a shell command on the remote machine as defined by the server name in the config.


Second param as String(<command>)
```js
r.remote('development-server', 'ls -al', function(r) {
  // do stuff
});
```

Second param as Object({cmd: <command> })
```js
r.remote('development-server', {cmd: 'ls -al'}, function(r) {
  // do stuff
});
```


## License [MIT](LICENSE)
