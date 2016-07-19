/* eslint no-console: 0 */

import fs from "fs";
import path from "path";
import recursiveReadSync from "recursive-readdir-sync";
import mkdirp from "mkdirp";

const RELEASES_DIR_NAME = "__WebpackCleanupPluginReleasesHistory";

class WebpackCleanupPlugin {

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const outputPath = compiler.options.output.path;
    const releasesPath = path.join(outputPath, RELEASES_DIR_NAME);
    const keepReleases = this.options.keepReleases;
    let excludeFromKeptReleases = [];

    if (keepReleases) {
      mkdirp.sync(releasesPath);
      const oldReleases = fs.readdirSync(releasesPath).sort().reverse();
      const releasesToKeep = oldReleases.slice(0, keepReleases - 1)
        .map(filename => path.join(RELEASES_DIR_NAME, filename));

      excludeFromKeptReleases = excludeFromKeptReleases.concat(releasesToKeep);

      releasesToKeep.forEach(releaseFileName => {
        const releaseAssets = JSON.parse(fs.readFileSync(path.join(outputPath, releaseFileName)));
        excludeFromKeptReleases = excludeFromKeptReleases.concat(releaseAssets);
      });
    }

    compiler.plugin("done", (stats) => {
      if (keepReleases) {
        const releaseFileName = `${new Date().getTime()}.json`;
        const releasePath = path.join(releasesPath, releaseFileName);
        excludeFromKeptReleases = excludeFromKeptReleases.concat([path.join(RELEASES_DIR_NAME, releaseFileName)]);
        const releaseAssets = stats.toJson().assets.map(asset => asset.name);
        fs.writeFileSync(releasePath, JSON.stringify(releaseAssets));
      }

      // recursiveReadSync returns prefix of outputPath + "/"
      const offset = outputPath.length + 1;
      const assets = stats.toJson().assets.map(asset => asset.name);

      const { exclude=[] } = this.options;
      const allExcluded = exclude.concat(excludeFromKeptReleases).concat(assets);

      const files = recursiveReadSync(outputPath)
        .map(path => path.substr(offset))
        .filter(file => allExcluded.indexOf(file) === -1)
        .map(file => `${outputPath}/${file}`);

      files.forEach(fs.unlinkSync);
      console.log("\nWebpackCleanupPlugin: %s file(s) deleted.", files.length);
    });
  }
}

export default WebpackCleanupPlugin;
