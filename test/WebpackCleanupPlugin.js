import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import { expect } from 'chai';
import { stub } from 'sinon';

import WebpackCleanupPlugin from '../src/WebpackCleanupPlugin';

const njoin = (x, y) => path.normalize(path.join(x, y));

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
        filename: 'bundle.js',
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
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'a.txt'));
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'b.txt'));
        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'bundle.js'));
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'foo.json'));
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'z.txt'));
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

    it('should only delete files created by webpack', (done) => {
      const webpackCleanupPlugin = new WebpackCleanupPlugin({ selfOnly: true, quiet: true });
      const compiler = webpack({
        ...webpackConfig,
        output: {
          path: outputPath,
          filename: 'bundle.js',
        },
        plugins: [webpackCleanupPlugin],
      });

      /**
       * mock the previous build's assets
       */
      webpackCleanupPlugin.previousAssets = ['bundle.js', 'a.txt', 'folder/q.txt'];

      compiler.run(() => {
        expect(webpackCleanupPlugin.previousAssets).to.deep.equal(['bundle.js']);
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'a.txt'));
        expect(unlinkSync).to.have.been.calledWith(njoin(outputPath, 'folder/q.txt'));

        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'folder/p.txt'));
        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'b.txt'));
        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'bundle.js'));
        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'foo.json'));
        expect(unlinkSync).to.not.have.been.calledWith(njoin(outputPath, 'z.txt'));
        done();
      });
    });
  });
});
