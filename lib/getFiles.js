'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFiles;

var _recursiveReaddirSync = require('recursive-readdir-sync');

var _recursiveReaddirSync2 = _interopRequireDefault(_recursiveReaddirSync);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFiles(fromPath) {
  var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var npath = _path2.default.normalize(fromPath);
  var files = (0, _recursiveReaddirSync2.default)(npath).map(function (p) {
    return p.substr(npath.length + 1);
  }) // get files relative to fromPath
  .filter(function (file) {
    return exclude.every(function (excluded) {
      return !(0, _minimatch2.default)(file, _path2.default.join(excluded), { dot: true });
    });
  }).map(function (file) {
    return _path2.default.join(npath, file);
  });
  return files;
}
//# sourceMappingURL=getFiles.js.map