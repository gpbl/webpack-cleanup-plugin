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

    compiler.plugin('done', (stats) => {
      if (compiler.outputFileSystem.constructor.name !== 'NodeOutputFileSystem') {
        return;
      }

      const assets = stats.toJson().assets.map(asset => asset.name);
      const exclude = union(this.options.exclude, assets);
      const files = getFiles(outputPath, exclude);

      if (this.options.preview) {
        console.warn('%s file(s) would be deleted:', files.length);
        files.forEach(file => console.warn('    %s', file));
        console.warn();
      } else {
        files.forEach(fs.unlinkSync);
      }
      if (!this.options.quiet) {
        console.warn('\nWebpackCleanupPlugin: %s file(s) deleted.', files.length);
      }
    });
  }

}

module.exports = WebpackCleanupPlugin;
