#!/usr/local/bin/node

/*global require, process*/

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

    (function (mode, sassDir, cssDir) {
        var sass = require('./sass/sass');

        if ('watch' === mode) {
            sass.watch(sassDir, cssDir);
        } else if ('update' === mode) {
            sass.update(sassDir, cssDir);
        }
    }(getArgument(1), getArgument(2), getArgument(3)));
}());