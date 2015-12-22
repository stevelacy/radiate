
'use strict';

const lab = exports.lab = require('lab').script();
const code = require('code');
const PROJECT_NAME = require('../package.json').name;
const log = require('../lib/log');
const Radiate = require('..');

lab.experiment(PROJECT_NAME + ' Radiate() ', function(){

  lab.test('export correct functions', function(done) {
    let radiate = new Radiate();
    code.expect(Radiate).to.be.a.function();
    code.expect(radiate).to.be.a.object();
    done();
  });

  lab.experiment('set', function() {
    let radiate = new Radiate();

    lab.test('set()', function(done) {
      code.expect(radiate.set).to.exist();
      code.expect(radiate.set).to.be.a.function();
      done();
    });

    lab.test('set(String)', function(done) {
      radiate.set('string');
      code.expect(radiate.config).to.exist();
      code.expect(radiate.config).to.be.an.object();
      code.expect(radiate.config.string).to.be.an.boolean();
      code.expect(radiate.config.string).to.equal(true);
      done();
    });

    lab.test('set(String, String)', function(done) {
      radiate.set('string', 'value');
      code.expect(radiate.config.string).to.be.an.string();
      code.expect(radiate.config.string).to.equal('value');
      done();
    });

    lab.test('set(String, Object)', function(done) {
      radiate.set('string', {key: 'value'});
      code.expect(radiate.config.string).to.be.an.object();
      code.expect(radiate.config.string.key).to.exist();
      code.expect(radiate.config.string.key).to.be.an.string();
      code.expect(radiate.config.string.key).to.equal('value');
      done();
    });

  });

  lab.experiment('exec', function() {
    let radiate = new Radiate();

    lab.test('exec()', function(done) {
      code.expect(radiate.exec).to.exist();
      code.expect(radiate.exec).to.be.a.function();
      done();
    });

    lab.test('exec(function) - task passthrough', function(done) {
      radiate.exec(function(r) {
        code.expect(r).to.be.an.instanceof(Radiate);
        done();
      })
    });

    lab.test('exec(String, function) - execute string', function(done) {
      radiate.exec('echo', function() {
        done();
      })
    });

    lab.test('exec(String, function) - execute string with opts', function(done) {
      radiate.exec('echo', ['-arg'], function() {
        done();
      })
    });

  });

  lab.experiment('deploy', function() {
    let radiate = new Radiate();

    lab.test('deploy()', function(done) {
      code.expect(radiate.deploy).to.exist();
      code.expect(radiate.deploy).to.be.a.function();
      done();
    });

  });

  lab.experiment('remote', function() {
    let radiate = new Radiate();

    lab.test('remote()', function(done) {
      code.expect(radiate.remote).to.exist();
      code.expect(radiate.remote).to.be.a.function();
      done();
    });

  });

});
