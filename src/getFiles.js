import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import path from 'path';

export default function getFiles(fromPath, exclude = []) {
  fromPath = path.normalize(fromPath)
  const files = recursiveReadSync(fromPath)
    .map(p => p.substr(fromPath.length + 1)) // get files relative to fromPath
    .filter(file =>
      exclude.every(excluded =>
        !minimatch(file, path.join(excluded), { dot: true })
      )
    )
    .map(file => path.join(fromPath, file));
  return files;
}
