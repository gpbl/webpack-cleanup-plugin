/* eslint-disable strict,global-require */

'use strict';

process.env.NODE_ENV = 'test';

module.exports = wallaby => ({
  files: [
    'src/**/*.js',
    'test/**/*',
    '!test/WebpackCleanupPlugin.js',
    '!test/getFiles.js',
  ],

  tests: ['test/WebpackCleanupPlugin.js', 'test/getFiles.js'],

  compilers: {
    '**/*.js': wallaby.compilers.babel(),
  },

  env: {
    type: 'node',
    runner: 'node',
  },

  delays: {
    run: 500,
  },

  // https://github.com/wallabyjs/public/issues/465
  workers: { initial: 1, regular: 1 },

  setup: () => {
    require('./test/setup');
  },
});
