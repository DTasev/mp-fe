const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

common.forEach((c) => {
    merge(c, {
        plugins: [
            new UglifyJSPlugin()
        ]
    });
});

module.exports = common;