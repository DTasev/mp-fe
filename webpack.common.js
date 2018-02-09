const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/build/main.js',
    plugins: [
        new CleanWebpackPlugin(['src/dist'])
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/dist'),
    }
};