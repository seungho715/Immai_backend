const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
module.exports = {
    resolve: {
        alias: {
            "vue": "vue/dist/vue.esm-bundler.js"
        }
    },
    entry: './src/test_frontend/index.js',
    output: {
        filename: 'index.bundled.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: "development",
    module: {
        rules: [
            {test: /\.vue$/, use: ['vue-loader']},
            {test: /\.css$/, use: ['vue-style-loader', 'css-loader']}
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
