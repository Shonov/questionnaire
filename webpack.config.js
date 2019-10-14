// https://habrahabr.ru/post/350886/
// https://github.com/Harrix/static-site-webpack-habrahabr

const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.pug`),
            inject: true,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';

    return {
        entry: [
            './src/js/index.js',
            './src/scss/style.scss'
        ],
        output: {
            filename: './js/bundle.[contenthash].js'
        },
        devtool: isDev ? "source-map" : false,
        module: {
            rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env',
                        sourceMap: isDev,
                    }
                }
            }, {
                test: /\.pug$/,
                loaders: ['pug-loader'],
            }, {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: isDev,
                            modules: false,
                            // importLoaders: 2,
                            // localIdentName: '[sha1:hash:hex:4]',
                            minimize: true,
                            url: false
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDev,
                            minimize: !isDev,
                        }
                    }, {
                        loader: 'postcss-loader',
                        // opions: {
                        //     sourceMap: isDev,
                        //     minimize: !isDev,
                        // }
                    },]
                })
            }, {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/html/includes'),
                use: ['raw-loader']
            }]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: './css/style.bundle.[hash].css',
                allChunks: true,
            }),
            new CopyWebpackPlugin([{
                from: './src/fonts',
                to: './fonts'
            }, {
                from: './src/favicon',
                to: './favicon'
            }, {
                from: './src/img',
                to: './img'
            },  {
                from: './src/*.php',
                to: './[name].[ext]',
                toType: 'template'
            }]),
        ].concat(htmlPlugins)
    }
};
