/*global require, process, console*/

/**
 * @author Joppe Aarts <joppe@zicht.nl>
 * @copyright Zicht Online <http://zicht.nl>
 */

(function () {
    'use strict';

    var getArgument;

    /**
     * Get an cli argument at a given position
     *
     * @param {number} position
     * @param {string} defVal
     * @returns {string}
     */
    getArgument = function (position, defVal) {
        var val = defVal;

        position += 1; // the first argument is "node" and the second is "watch.js"

        if (process.argv.length >= position) {
            val = process.argv[position];
        }

        return val;
    };

    (function () {
        var mode,
            sassDir,
            cssDir,
            chalk = require('chalk'),
            sass = require('./sass/sass'),
            pjson = require('./package.json');

        if (process.argv.length === 2) {
            console.log(chalk.bold('    _______      _     _      _____                '));
            console.log(chalk.bold('   |___  (_)    | |   | |    / ____|               '));
            console.log(chalk.bold('      / / _  ___| |__ | |_  | (___   __ _ ___ ___  '));
            console.log(chalk.bold('     / / | |/ __| \'_ \\| __|  \\___ \\ / _` / __/ __| '));
            console.log(chalk.bold('    / /__| | (__| | | | |_   ____) | (_| \\__ \\__ \\ '));
            console.log(chalk.bold('   /_____|_|\\___|_| |_|\\__| |_____/ \\__,_|___/___/ '));
            console.log(chalk.bold('                                                   '));

            console.log(chalk.green.bold('Zicht Sass version ' + pjson.version));
            console.log(chalk.green.bold('Usage:'));
            console.log(chalk.green('zsass <update|watch> <sass-dir> <css-dir>'));
        } else if (process.argv.length === 3) {
            console.log(chalk.red('Too few paramaters'));
        } else {
            if (process.argv.length === 4) {
                mode = 'update';
                sassDir = getArgument(1);
                cssDir = getArgument(2);
            } else {
                mode = getArgument(1);
                sassDir = getArgument(2);
                cssDir = getArgument(3);
            }

            if ('watch' === mode) {
                console.log(chalk.green.bold('Watch'));
                sass.watch(sassDir, cssDir);
            } else if ('update' === mode) {
                console.log(chalk.green.bold('Update'));
                sass.update(sassDir, cssDir);
            }
        }
    }());
}());