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
        files;

    files = fs.readdirSync(path);

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

    var cwd = process.cwd();

    if (false === /^\//.test(path)) {
        path = cwd + '/' + path;
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
        path = require('path'),
        fs = require('fs'),
        chalk = require('chalk'),
        cssFile = path.join(cssDir, path.basename(sassFile, '.scss') + '.css'),
        options = {
            sourceMap: false,
            sourceComments: 'none',
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
            var watch = require('node-watch');

            sassDir = getPath(sassDir);
            cssDir = getPath(cssDir);

            compileFiles(sassDir, cssDir);

            watch(sassDir, function () {
                compileFiles(sassDir, cssDir);
            });
        },

        /**
         * Update all .scss files in a given directory
         *
         * @param {string} sassDir
         * @param {string} cssDir
         */
        update: function (sassDir, cssDir) {
            sassDir = getPath(sassDir);
            cssDir = getPath(cssDir);

            compileFiles(sassDir, cssDir);
        }
    };
}());
