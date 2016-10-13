# Changelog

## [v0.4.1](https://github.com/gpbl/webpack-cleanup-plugin/tree/v0.4.1) (2016-10-13)

* Fixed [an issue](https://github.com/gpbl/webpack-cleanup-plugin/pull/20) with relative files ([#21](https://github.com/gpbl/webpack-cleanup-plugin/pull/21)).

## [v0.4.0](https://github.com/gpbl/webpack-cleanup-plugin/tree/v0.4.0) (2016-09-18)

* Added `preview` option
* Add support for minimatch globs to `exclude` option ([#18](https://github.com/gpbl/webpack-cleanup-plugin/pull/18) by [geekuillaume](https://github.com/geekuillaume)).

## [v0.3.1](https://github.com/gpbl/webpack-cleanup-plugin/tree/v0.3.1) (2016-08-31)

* Fixed an issue with plugin initialization ([#14](https://github.com/gpbl/webpack-cleanup-plugin/pull/14) by [ifamed](https://github.com/ifamed)).

## [v0.3.0](https://github.com/gpbl/webpack-cleanup-plugin/tree/v0.3.0) (2016-08-20)

* Added `quiet` option ([#12](https://github.com/gpbl/webpack-cleanup-plugin/pull/12) by [Bartuz](https://github.com/Bartuz)).
* Do nothing if the target filesystem is not the default ([#8](https://github.com/gpbl/webpack-cleanup-plugin/pull/8) by [jonathanperret](https://github.com/jonathanperret)).

## [v0.2.0](https://github.com/gpbl/webpack-cleanup-plugin/tree/v0.2.0) (2016-02-13)

* Error when initializing the plugin without options (#1, #6)
* Directories were no cleaned up recursively (#2, #5)