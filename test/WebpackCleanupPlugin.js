import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import { expect } from 'chai';
import { stub } from 'sinon';

import WebpackCleanupPlugin from '../src/WebpackCleanupPlugin';

describe('WebpackCleanupPlugin', () => {
  it('should set options from constructor', () => {
    const plugin = new WebpackCleanupPlugin({ quiet: true, preview: true, exclude: ['a.txt'] });
    expect(plugin.options.quiet).to.be.true;
    expect(plugin.options.preview).to.be.true;
    expect(plugin.options.exclude).to.eql(['a.txt']);
  });

  describe('when deleting files', () => {
    let unlinkSync;
    const outputPath = path.resolve(__dirname, 'assets');
    const webpackConfig = {
      entry: path.join(__dirname, 'entry.js'),
      output: {
        path: outputPath,
      },
    };

    beforeEach(() => { unlinkSync = stub(fs, 'unlinkSync'); });
    afterEach(() => { unlinkSync.restore(); });

    it('should delete the extraneous files from the output path', (done) => {
      const compiler = webpack({
        ...webpackConfig,
        plugins: [new WebpackCleanupPlugin({ quiet: true })],
      });
      compiler.run(() => {
        expect(unlinkSync).to.have.been.calledWith(`${outputPath}/a.txt`);
        expect(unlinkSync).to.have.been.calledWith(`${outputPath}/b.txt`);
        expect(unlinkSync).to.not.have.been.calledWith(`${outputPath}/bundle.js`);
        expect(unlinkSync).to.have.been.calledWith(`${outputPath}/foo.json`);
        expect(unlinkSync).to.have.been.calledWith(`${outputPath}/z.txt`);
        done();
      });
    });

    it('should not delete when previewing files', (done) => {
      const compiler = webpack({
        ...webpackConfig,
        plugins: [
          new WebpackCleanupPlugin({ preview: true }),
        ],
      });
      compiler.run(() => {
        expect(unlinkSync).to.not.have.been.called;
        done();
      });
    });
  });
});
