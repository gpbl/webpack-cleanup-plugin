import path from 'path';
import { expect } from 'chai';
import getFiles from '../src/getFiles';

const assetsPath = path.resolve(__dirname, 'assets');

describe('getFiles', () => {
  it('get recursively the files in the output path', () => {
    const files = getFiles(assetsPath);
    expect(files).to.have.length(7);
    expect(files).to.include(`${assetsPath}/folder/p.txt`);
    expect(files).to.include(`${assetsPath}/folder/q.txt`);
    expect(files).to.include(`${assetsPath}/a.txt`);
    expect(files).to.include(`${assetsPath}/b.txt`);
    expect(files).to.include(`${assetsPath}/bundle.js`);
    expect(files).to.include(`${assetsPath}/foo.json`);
    expect(files).to.include(`${assetsPath}/z.txt`);
  });
  it('exclude files from array', () => {
    const files = getFiles(assetsPath, ['a.txt', 'b.txt']);
    expect(files).to.have.length(5);
    expect(files).to.not.include(`${assetsPath}/a.txt`);
    expect(files).to.not.include(`${assetsPath}/b.txt`);
  });
  it('exclude files from glob', () => {
    const files = getFiles(assetsPath, ['folder/**/*.txt']);
    expect(files).to.have.length(5);
    expect(files).to.not.include(`${assetsPath}/folder/p.txt`);
    expect(files).to.not.include(`${assetsPath}/folder/q.txt`);
    expect(files).to.include(`${assetsPath}/a.txt`);
    expect(files).to.include(`${assetsPath}/b.txt`);
    expect(files).to.include(`${assetsPath}/bundle.js`);
    expect(files).to.include(`${assetsPath}/foo.json`);
    expect(files).to.include(`${assetsPath}/z.txt`);
  });
});
