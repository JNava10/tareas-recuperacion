const path = require('path');
const fs = require('fs');

const fileNames = fs.readdirSync('./js').reduce((acc, v) => ({ ...acc, [v]: `./js/${v}` }), {});

const config = {
    entry: fileNames,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]',
    },
    devServer: {
        static: {
            directory: __dirname,
        },
        compress: true,
        port: 9000,
    },
};

module.exports = config;