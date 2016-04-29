/*global require, process, console*/

/**
 * @author Joppe Aarts <joppe@zicht.nl>
 * @copyright Zicht Online <http://zicht.nl>
 */

(function () {
    'use strict';

    var argv = require('minimist')(process.argv.slice(2), {
            string: 'outputStyle',
            boolean: ['sourceMap', 'sourceComments'],
            alias: {
                s: 'outputStyle',
                m: 'sourceMap',
                c: 'sourceComments'
            },
            default: {
                outputStyle: 'compressed',
                sourceMap: false,
                sourceComments: false
            }

        });

    (function () {
        var mode,
            sassDir,
            cssDir,
            chalk = require('chalk'),
            sass = require('./sass/sass'),
            pjson = require('./package.json'),
            options = {
                sourceMap: argv.sourceMap,
                sourceComments: argv.sourceComments,
                outputStyle: argv.outputStyle
            };

        if (0 === argv._.length) {
            console.log(chalk.bold('    _______      _     _      _____                '));
            console.log(chalk.bold('   |___  (_)    | |   | |    / ____|               '));
            console.log(chalk.bold('      / / _  ___| |__ | |_  | (___   __ _ ___ ___  '));
            console.log(chalk.bold('     / / | |/ __| \'_ \\| __|  \\___ \\ / _` / __/ __| '));
            console.log(chalk.bold('    / /__| | (__| | | | |_   ____) | (_| \\__ \\__ \\ '));
            console.log(chalk.bold('   /_____|_|\\___|_| |_|\\__| |_____/ \\__,_|___/___/ '));
            console.log(chalk.bold('                                                   '));

            console.log(chalk.green.bold('Zicht Sass version ' + pjson.version));
            console.log(chalk.green.bold('Usage:'));
            console.log(chalk.green('zsass [update|watch] <sass-dir> <css-dir> [--sourceMap=true|false] [--sourceComments=true|false] [--outputStyle=style]'));
        } else if (1 === argv._.length) {
            console.log(chalk.red('Too few paramaters'));
        } else {
            if (2 === argv._.length) {
                mode = 'update';
                sassDir = argv._[0];
                cssDir = argv._[1];
            } else {
                mode = argv._[0];
                sassDir = argv._[1];
                cssDir = argv._[2];
            }
            console.log(mode, sassDir, cssDir);

            if ('watch' === mode) {
                console.log(chalk.green.bold('Watch'));
                console.log(chalk.white('Press Ctrl+c to end'));
                sass.watch(sassDir, cssDir, options);
            } else if ('update' === mode) {
                console.log(chalk.green.bold('Update'));
                sass.update(sassDir, cssDir, options);
            }
        }
    }());
}());