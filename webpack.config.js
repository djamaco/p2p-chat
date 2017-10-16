const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // This is the "main" file which should include all other modules
    entry: {
        'js/bundle.js': path.resolve(__dirname, './src/js/index.js'),
    },
    // Where should the compiled file go?
    output: {
        // To the `dist` folder
        path: path.resolve(__dirname, './public'), // With the filename `build.js` so it's dist/build.js
        filename: '[name]'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        },
    },
    module: {
        // Special compilation rules
        loaders: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.js$/,
                // Transform it with babel
                loader: 'babel',
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|sass)$/i,
                include: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'src/scss'),
                ],
                loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"]),
            },
            {
                test: /\.(eot|svg|ttf|woff2?)$/i,
                include: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'src'),
                ],
                loader: "file-loader?outputPath=/files/",
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/style.css", { allChunks: true })
    ],
};