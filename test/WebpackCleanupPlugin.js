import path from 'path';
import { expect } from 'chai';
import webpack from 'webpack';
import WebpackCleanupPlugin from '../src/WebpackCleanupPlugin';

describe('WebpackCleanupPlugin', () => {
  it('should set options from constructor', () => {
    const plugin = new WebpackCleanupPlugin({ quiet: true, preview: true, exclude: ['a.txt'] });
    expect(plugin.options.quiet).to.be.true;
    expect(plugin.options.preview).to.be.true;
    expect(plugin.options.exclude).to.eql(['a.txt']);
  });
  it('', () => {
    const outputPath = path.resolve(__dirname, 'assets');
    const compiler = webpack({
      output: {
        path: outputPath,
      },
      plugins: [new WebpackCleanupPlugin()],
    });
  });
});
