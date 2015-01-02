/*global require, process, console, module*/

/**
 * @author Joppe Aarts <joppe@zicht.nl>
 * @copyright Zicht Online <http://zicht.nl>
 */

var getFiles,
    getPath,
    compileFile,
    compileFiles;

/**
 * Get all files with a given extension in a given directory
 *
 * @param {string} path
 * @param {Function} [filter]
 * @returns {Array}
 */
getFiles = function (path, filter) {
    'use strict';

    var fs = require('fs'),
        files,
        subdirs;

    files = fs.readdirSync(path);

    subdirs = files.filter(function(f) {
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
getPath = function (path) {
    'use strict';

    var fs = require('fs'),
        cwd = process.cwd();

    if (false === /^\//.test(path)) {
        path = cwd + '/' + path;
    }

    if (!fs.existsSync(path)) {
        throw 'Path "' + path + '" does not exist';
    }

    return path;
};

/**
 * Compile a scss file to css file
 *
 * @param {string} sassDir
 * @param {string} sassFile
 * @param {string} cssDir
 */
compileFile = function (sassDir, sassFile, cssDir) {
    'use strict';

    var sass = require('node-sass'),
        fs = require('fs'),
        chalk = require('chalk'),
        cssFile = cssDir + '/' + sassFile.replace(/scss$/, 'css'),
        options = {
            sourceMap: false,
            sourceComments: false,
            outputStyle: 'compressed',
            file: sassDir + '/' + sassFile,
            success: function (css) {
                fs.writeFile(cssFile, css, function (err) {
                    if (err) {
                        console.log(chalk.red('error writing ' + sassFile, err));
                    } else {
                        console.log(chalk.green('compile ', sassFile));
                    }
                });
            },
            error: function (error, status) {
                console.log(chalk.red('compile error ', error, status));
            }
        };

    sass.render(options);
};

/**
 * Compile all scss files in a given directory
 *
 * @param {string} sassDir
 * @param {string} cssDir
 */
compileFiles = function (sassDir, cssDir) {
    'use strict';

    var files;

    files = getFiles(sassDir, function (value) {
        return (/^[^_].+\.scss$/).test(value);
    });

    files.forEach(function (sassFile) {
        compileFile(sassDir, sassFile, cssDir);
    });
};

module.exports = (function () {
    'use strict';

    return {
        /**
         * Watch a directory for changes in scss files
         *
         * @param {string} sassDir
         * @param {string} cssDir
         */
        watch: function (sassDir, cssDir) {
            var watch = require('node-watch'),
                chalk = require('chalk');

            try {
                sassDir = getPath(sassDir);
                cssDir = getPath(cssDir);

                compileFiles(sassDir, cssDir);

                watch(sassDir, function () {
                    compileFiles(sassDir, cssDir);
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
         */
        update: function (sassDir, cssDir) {
            var chalk = require('chalk');

            try {
                sassDir = getPath(sassDir);
                cssDir = getPath(cssDir);

                compileFiles(sassDir, cssDir);
            } catch (exception) {
                console.log(chalk.red(exception));
            }
        }
    };
}());
