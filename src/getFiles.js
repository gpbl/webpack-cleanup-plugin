import recursiveReadSync from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import path from 'path';

export default function getFiles(fromPath, exclude = [], include /* : ?Array<string> */) {
  const files = recursiveReadSync(fromPath).filter((file) => {
    /**
     * If 'include' is undefined, include all files
     */
    if (include) {
      const isIncluded = include.some(included =>
        minimatch(path.relative(fromPath, file), path.join(included), {
          dot: true,
        }),
      );

      if (!isIncluded) {
        return false;
      }
    }

    return exclude.every(
      excluded =>
        !minimatch(path.relative(fromPath, file), path.join(excluded), {
          dot: true,
        }),
    );
  });
  return files;
}
