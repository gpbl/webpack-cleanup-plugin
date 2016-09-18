import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';

export default function getFiles(path, exclude = []) {
  const files = recursiveReadSync(path)
    .map(p => p.substr(path.length + 1)) // get files relative to path
    .filter(file =>
      exclude.every(excluded =>
        !minimatch(file, excluded, { dot: true })
      )
    )
    .map(file => `${path}/${file}`);
  return files;
}
