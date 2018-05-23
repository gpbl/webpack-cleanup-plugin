import path from 'path';
import { expect } from 'chai';
import getFiles from '../src/getFiles';

const assetsPath = path.resolve(__dirname, 'assets');

const njoin = (x, y) => path.normalize(path.join(x, y));

describe('getFiles', () => {
  it('get recursively the files in the output path', () => {
    const files = getFiles(assetsPath);
    expect(files).to.have.length(7);
    expect(files).to.include(njoin(assetsPath, 'folder/p.txt'));
    expect(files).to.include(njoin(assetsPath, 'folder/q.txt'));
    expect(files).to.include(njoin(assetsPath, 'a.txt'));
    expect(files).to.include(njoin(assetsPath, 'b.txt'));
    expect(files).to.include(njoin(assetsPath, 'bundle.js'));
    expect(files).to.include(njoin(assetsPath, 'foo.json'));
    expect(files).to.include(njoin(assetsPath, 'z.txt'));
  });
  it('handles trailing slash correctly', () => {
    const files = getFiles(`${assetsPath}/`);
    expect(files).to.include(njoin(assetsPath, 'folder/p.txt'));
  });
  it('handles relative paths', () => {
    const files = getFiles('./test/assets');
    expect(files).to.include(path.normalize('test/assets/folder/p.txt'));
  });
  it('get recursively the files in the relative path using POSIX separator', () => {
    const files = getFiles('./test/assets');
    expect(files).to.have.length(7);
    expect(files).to.include(njoin('./test/assets', 'folder/p.txt'));
    expect(files).to.include(njoin('./test/assets', 'folder/q.txt'));
    expect(files).to.include(njoin('./test/assets', 'a.txt'));
    expect(files).to.include(njoin('./test/assets', 'b.txt'));
    expect(files).to.include(njoin('./test/assets', 'bundle.js'));
    expect(files).to.include(njoin('./test/assets', 'foo.json'));
    expect(files).to.include(njoin('./test/assets', 'z.txt'));
  });
  it('exclude files from array', () => {
    const files = getFiles(assetsPath, ['a.txt', 'b.txt']);
    expect(files).to.have.length(5);
    expect(files).to.not.include(njoin(assetsPath, 'a.txt'));
    expect(files).to.not.include(njoin(assetsPath, 'b.txt'));
  });
  it('exclude relative files from array', () => {
    const files = getFiles(assetsPath, ['./a.txt', './b.txt']);
    expect(files).to.have.length(5);
    expect(files).to.not.include(njoin(assetsPath, 'a.txt'));
    expect(files).to.not.include(njoin(assetsPath, 'b.txt'));
  });
  it('exclude files from glob', () => {
    const files = getFiles(assetsPath, ['folder/**/*.txt']);
    expect(files).to.have.length(5);
    expect(files).to.not.include(path.join(assetsPath, 'folder/p.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'folder/q.txt'));
    expect(files).to.include(path.join(assetsPath, 'a.txt'));
    expect(files).to.include(path.join(assetsPath, 'b.txt'));
    expect(files).to.include(path.join(assetsPath, 'bundle.js'));
    expect(files).to.include(path.join(assetsPath, 'foo.json'));
    expect(files).to.include(path.join(assetsPath, 'z.txt'));
  });

  it('only look at includes', () => {
    const include = ['bundle.js', 'folder/p.txt'];

    const files = getFiles(assetsPath, [], include);

    expect(files).to.have.length(2);
    expect(files).to.include(path.join(assetsPath, 'bundle.js'));
    expect(files).to.include(path.join(assetsPath, 'folder/p.txt'));

    expect(files).to.not.include(path.join(assetsPath, 'folder/q.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'a.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'b.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'foo.json'));
    expect(files).to.not.include(path.join(assetsPath, 'z.txt'));
  });

  it('only look at includes but respects excludes', () => {
    const include = ['bundle.js', 'folder/p.txt'];

    const files = getFiles(assetsPath, ['folder/**/*.txt'], include);

    expect(files).to.have.length(1);
    expect(files).to.include(path.join(assetsPath, 'bundle.js'));

    expect(files).to.not.include(path.join(assetsPath, 'folder/p.txt'));

    expect(files).to.not.include(path.join(assetsPath, 'folder/q.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'a.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'b.txt'));
    expect(files).to.not.include(path.join(assetsPath, 'foo.json'));
    expect(files).to.not.include(path.join(assetsPath, 'z.txt'));
  });
});
