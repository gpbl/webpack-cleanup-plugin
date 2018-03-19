/* eslint no-console: 0 */

import fs from 'fs';
import union from 'lodash.union';

import getFiles from './getFiles';

class WebpackCleanupPlugin {

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const outputPath = compiler.options.output.path;

    compiler.hooks.done.tap('webpack-cleanup-plugin', (stats) => {
      if (compiler.outputFileSystem.constructor.name !== 'NodeOutputFileSystem') {
        return;
      }

      const assets = stats.toJson().assets.map(asset => asset.name);
      const exclude = union(this.options.exclude, assets);
      const files = getFiles(outputPath, exclude);

      if (this.options.preview) {
        console.log('%s file(s) would be deleted:', files.length);
        files.forEach(file => console.log('    %s', file));
        console.log();
      } else {
        files.forEach(fs.unlinkSync);
      }
      if (!this.options.quiet) {
        console.log('\nWebpackCleanupPlugin: %s file(s) deleted.', files.length);
      }
    });
  }

}

module.exports = WebpackCleanupPlugin;
