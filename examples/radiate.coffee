'use strict';

module.exports =
  exec: (r) ->
    r.exec 'ls', ['-al']
