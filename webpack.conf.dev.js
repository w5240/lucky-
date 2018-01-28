/**
 * 开发脚本
 */
const LINKS = require('./src/LINKS');
const ROOT_DIST = '/app/dist';              // 所有资源会被打包至此
const STATIC_DIST = ROOT_DIST + '/static/'; // 除html外文件打包至此
const STATIC_PREFIX = LINKS.WEB_BASE + '/static/';           // html内引用静态资源的前缀, '/static/'或是'http://cdn.xxx.com/mystatic/'

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');

if (!process.env.NODE_ENV) throw new Error('请设置NODE_ENV');
console.log('webpacking for', process.env.NODE_ENV);
module.exports = {

    entry: {
        main: path.join(process.cwd(), '/src/app.js'),
        vendor: [
            'vue', 'web-model', 'vuex', 'vue-router',
            'date-fns', 'jquery', 'js-cookie',
        ],
        echarts: [
            'echarts/lib/echarts',
            'echarts/lib/chart/pie',
            'echarts/lib/chart/funnel',
            'echarts/lib/chart/bar',
            'echarts/lib/chart/line',
            'echarts/lib/component/legend',
            'echarts/lib/component/tooltip',
            'echarts/map/js/world'
        ]
    },
    output: {
        path: path.join(process.cwd() + STATIC_DIST),
        filename: 'sms-[name].js',
        publicPath: STATIC_PREFIX,
        chunkFilename: 'sms-[name].js'
    },
    devServer: {
        inline: true,
        contentBase: path.join(process.cwd(), ROOT_DIST)
    },

    /**
     * develop tool flags
     * */
    devtool: '#module-source-map',
    cache: true,

    /**
     * 此处配置公用插件, 开发和发版本不同配置的插件在上面
     */
    plugins: [

        new webpack.HotModuleReplacementPlugin(),

        new webpack.NoEmitOnErrorsPlugin(),

        // 提取common模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'echarts'],
            // children: true,
            // minChunks: 2
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: true,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true,
            'process.env': {
                BABEL_ENV: JSON.stringify('development'),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
        }),

        new styleLintPlugin({
            configFile: path.join(__dirname, '/.stylelintrc'),
            quiet: false
        }),

        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === '52' ? path.join(process.cwd(), '/app/dist/index.html') : path.join(process.cwd(), '/app/dist/sms.html'),
            template: path.join(process.cwd(), '/src/template.html'),
            inject: false,
            publicPath: LINKS.ORIGIN + LINKS.WEB_BASE,
            production: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta',
            minify: {
                caseSensitive: true,
                collapseWhitespace: true
            },
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin()
    ],


    /**
     * loaders
     */
    module: {
        rules: [
            // font loader
            {
                test: /\.(ttf|eot|woff|svg)$/i,
                loader: 'url-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                loader: 'stylelint-loader',
                // options: {

                // }
            },
            {
                test: /(\.vue|\.js)$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                loader: 'eslint-loader',
                options: {
                    env: {
                        'es6': true
                    }
                }
            },
            // js loader
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(process.cwd() + '/src'),
                ]
            },
            // vue loader
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                // options: {

                // }
            },
            // scss loader
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            // less loader
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // 图片loader
            {
                test: /\.(jpe?g|gif|png)$/i,
                loader: 'url-loader',
                options: {
                    limit: '5280',
                    name: 'images/[name].[ext]'
                }
            }
        ]
    }

};
