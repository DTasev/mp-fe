const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = [{
        entry: './build/ts/tanks/main.js',
        plugins: [
            new CleanWebpackPlugin(['static/tanks/js/'])
        ],
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'static/tanks/js/'),
        }
    },
    {
        entry: './build/ts/mc/main.js',
        plugins: [
            new CleanWebpackPlugin(['static/tanks/js/mc'])
        ],
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'static/tanks/js/mc'),
        }
    }
];