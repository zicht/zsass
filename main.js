/*global require, process*/

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
            sass = require('./sass/sass');

        if (process.argv.length < 3) {
            console.log('Too few paramaters');
        } else {
            if (process.argv.length < 4) {
                mode = 'update';
                sassDir = getArgument(1);
                cssDir = getArgument(2);
            } else {
                mode = getArgument(1);
                sassDir = getArgument(2);
                cssDir = getArgument(3);
            }

            if ('watch' === mode) {
                sass.watch(sassDir, cssDir);
            } else if ('update' === mode) {
                sass.update(sassDir, cssDir);
            }
        }
    }());
}());