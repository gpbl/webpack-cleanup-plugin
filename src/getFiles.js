import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import path from 'path';

export default function getFiles(fromPath, exclude = []) {
  const npath = path.normalize(fromPath);
  const files = recursiveReadSync(npath)
    .map(p => p.substr(npath.length + 1)) // get files relative to fromPath
    .filter(file =>
      exclude.every(excluded =>
        !minimatch(file, path.join(excluded), { dot: true })
      )
    )
    .map(file => path.join(npath, file));
  return files;
}
