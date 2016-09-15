/* eslint no-console: 0 */

import fs from 'fs';
import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';

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

      const {
        exclude = [],
        quiet = false,
      } = this.options;

      const offset = outputPath.length + 1; // recursiveReadSync returns prefix of outputPath + "/"
      const assets = stats.toJson().assets.map(asset => asset.name);
      const files = recursiveReadSync(outputPath)
        .map(path => path.substr(offset))
        .filter((file) => {
          for (let i = 0; i < exclude.length; i += 1) {
            if (minimatch(file, exclude[i], { dot: true })) {
              return false;
            }
          }
          return assets.indexOf(file) === -1;
        })
        .map(file => `${outputPath}/${file}`);

      files.forEach(fs.unlinkSync);

      if (!quiet) {
        console.log('\nWebpackCleanupPlugin: %s file(s) deleted.', files.length);
      }
    });
  }

}

module.exports = WebpackCleanupPlugin;
