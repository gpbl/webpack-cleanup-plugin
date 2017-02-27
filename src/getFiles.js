import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import path from 'path';

export default function getFiles(fromPath, exclude = []) {
  const files = recursiveReadSync(fromPath)
    .filter(file =>
      exclude.every(excluded =>
        !minimatch(path.relative(fromPath, file), path.join(excluded), { dot: true }),
      ),
    );
  return files;
}
