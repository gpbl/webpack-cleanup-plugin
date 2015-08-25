/* eslint no-console: 0 */

import fs from "fs";

class WebpackCleanupPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {

    const outputPath = compiler.options.output.path;

    compiler.plugin("done", (stats) => {
      const { exclude=[] } = this.options;
      const assets = stats.toJson().assets.map(asset => asset.name);

      const files = fs.readdirSync(outputPath)
        .filter(file => exclude.indexOf(file) === -1 && assets.indexOf(file) === -1)
        .map(file => `${outputPath}/${file}`);

      files.forEach(fs.unlinkSync);

      console.log("\nWebpackCleanupPlugin: %s file(s) deleted.", files.length);

    });

  }

}

export default WebpackCleanupPlugin;
