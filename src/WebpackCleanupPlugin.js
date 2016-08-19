/* eslint no-console: 0 */

import fs from "fs";
import recursiveReadSync from "recursive-readdir-sync";

class WebpackCleanupPlugin {

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {

    const outputPath = compiler.options.output.path;

    compiler.plugin("done", (stats) => {
      const { exclude=[], quiet=false } = this.options;
      // recursiveReadSync returns prefix of outputPath + "/"
      const offset = outputPath.length + 1;
      const assets = stats.toJson().assets.map(asset => asset.name);
      const files = recursiveReadSync(outputPath)
        .map(path => path.substr(offset))
        .filter(file => exclude.indexOf(file) === -1 && assets.indexOf(file) === -1)
        .map(file => `${outputPath}/${file}`);

      files.forEach(fs.unlinkSync);

      !quiet && console.log("\nWebpackCleanupPlugin: %s file(s) deleted.", files.length);

    });

  }

}

export default WebpackCleanupPlugin;
