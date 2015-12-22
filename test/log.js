
'use strict';

const lab = exports.lab = require('lab').script();
const code = require('code');
const PROJECT_NAME = require('../package.json').name;
const log = require('../lib/log');

lab.experiment(PROJECT_NAME + ' log: ', function(){

  lab.test('export correct functions', function(done) {
    code.expect(log).to.be.a.function();
    code.expect(log.error).to.be.a.function();
    code.expect(log.raw).to.be.a.function();
    done();
  });

});
