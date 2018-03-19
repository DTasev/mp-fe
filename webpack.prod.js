const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');


for (let i = 0; i < common.length; i++) {
    common[i] = merge(common[i], {
        plugins: [
            new UglifyJSPlugin()
        ]
    });
}


module.exports = common;