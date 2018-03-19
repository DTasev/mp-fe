const merge = require('webpack-merge');
const common = require('./webpack.common.js');

for (let i = 0; i < common.length; i++) {
    common[i] = merge(common[i], {
        devtool: 'inline-source-map'
    });
}

module.exports = common;