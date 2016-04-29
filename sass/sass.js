/*global require, process, console, module*/

/**
 * @author Joppe Aarts <joppe@zicht.nl>
 * @copyright Zicht Online <http://zicht.nl>
 */

module.exports = (function () {
    'use strict';

    var fs = require('fs'),
        sass = require('node-sass'),
        watch = require('node-watch'),
        chalk = require('chalk'),
        getFiles,
        getAbsolutePath,
        getRelativePath,
        compileFile,
        compileFiles,
        ensurePath;

    /**
     * Get all files with a given extension in a given directory
     *
     * @param {string} path
     * @param {Function} [filter]
     * @returns {Array}
     */
    getFiles = function (path, filter) {
        var files,
            subdirs;

        files = fs.readdirSync(path);

        subdirs = files.filter(function (f) {
            return fs.lstatSync(path + '/' + f).isDirectory();
        });

        subdirs.forEach(function(f) {
            getFiles(path + '/' + f, filter).forEach(function(file) {
                files.push(f + '/' + file);
            });
        });

        if (undefined !== filter) {
            files = files.filter(filter);
        }

        return files;
    };

    /**
     * @param {string} path
     * @returns {string}
     */
    getAbsolutePath = function (path) {
        var cwd = process.cwd();

        if (false === /^\//.test(path)) {
            path = cwd + '/' + path;
        }

        if (!fs.existsSync(path)) {
            throw 'Path "' + path + '" does not exist';
        }

        return path;
    };

    /**
     * @param {string} base
     * @param {string} filepath
     * @returns {string}
     */
    getRelativePath = function (base, filepath) {
        var path;

        // remove the file part
        path = filepath.replace(/\/[^\/]+\.s?css$/g, '');

        // remove the base
        path = path.replace(base, '');

        // remove the leading slash
        path = path.replace(/^\//, '');

        return path;
    };

    /**
     * @param {string} base
     * @param {string} filepath
     */
    ensurePath = function (base, filepath) {
        var relativePath = getRelativePath(base, filepath),
            dirs = relativePath.split('/'),
            target = base;

        if (false === fs.existsSync(base + '/' + relativePath)) {
            dirs = relativePath.split('/');

            dirs.forEach(function (dir) {
                target += '/' + dir;

                if (!fs.existsSync(target)) {
                    fs.mkdirSync(target);
                }
            });
        }
    };

    /**
     * Compile a scss file to css file
     *
     * @param {string} sassDir
     * @param {string} sassFile
     * @param {string} cssDir
     * @param {Object} options
     */
    compileFile = function (sassDir, sassFile, cssDir, options) {
        var cssFile = cssDir + '/' + sassFile.replace(/scss$/, 'css');

        ensurePath(cssDir, cssFile);

        sass.render({
            sourceMap: options.sourceMap,
            sourceComments: options.sourceComments,
            outputStyle: options.outputStyle,
            file: sassDir + '/' + sassFile
        }, function (error, result) {
            if (error) {
                console.log(chalk.red('compile error ', error));
            } else {
                fs.writeFile(cssFile, result.css.toString(), function (err) {
                    if (err) {
                        console.log(chalk.red('error writing ' + sassFile, err));
                    } else {
                        console.log(chalk.green('compile ', sassFile));
                    }
                });
            }
        });
    };

    /**
     * Compile all scss files in a given directory
     *
     * @param {string} sassDir
     * @param {string} cssDir
     * @param {Object} options
     */
    compileFiles = function (sassDir, cssDir, options) {
        var files;

        files = getFiles(sassDir, function (value) {
            return (/^[^_]+\.scss$/).test(value);
        });

        files.forEach(function (sassFile) {
            compileFile(sassDir, sassFile, cssDir, options);
        });
    };

    return {
        /**
         * Watch a directory for changes in scss files
         *
         * @param {string} sassDir
         * @param {string} cssDir
         * @param {Object} options
         */
        watch: function (sassDir, cssDir, options) {
            try {
                sassDir = getAbsolutePath(sassDir);
                cssDir = getAbsolutePath(cssDir);

                compileFiles(sassDir, cssDir, options);

                watch(sassDir, function () {
                    compileFiles(sassDir, cssDir, options);
                });
            } catch (exception) {
                console.log(chalk.red(exception));
            }
        },

        /**
         * Update all .scss files in a given directory
         *
         * @param {string} sassDir
         * @param {string} cssDir
         * @param {Object} options
         */
        update: function (sassDir, cssDir, options) {
            try {
                sassDir = getAbsolutePath(sassDir);
                cssDir = getAbsolutePath(cssDir);

                compileFiles(sassDir, cssDir, options);
            } catch (exception) {
                console.log(chalk.red(exception));
            }
        }
    };
}());