/**
 * 发布脚本
 */
const LINKS = require('./src/LINKS');
const ROOT_DIST = '/app/dist';              // 所有资源会被打包至此
const STATIC_DIST = ROOT_DIST + '/static/'; // 除html外文件打包至此
const STATIC_PREFIX = LINKS.WEB_BASE + '/static/';           // html内引用静态资源的前缀, '/static/'或是'http://cdn.xxx.com/mystatic/'

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        filename: 'sms-[name].[hash:8].js',
        publicPath: STATIC_PREFIX,
        chunkFilename: 'sms-[name].[chunkhash:6].js'
    },
    
    /**
     * develop tool flags
     * */
    devtool: false,
    cache: false,
    
    /**
     * 此处配置公用插件, 开发和发版本不同配置的插件在上面
     */
    plugins: [
        
        // Cleanup the destination folder before compiling our final assets
        new CleanPlugin(path.join(process.cwd(), STATIC_DIST), {
            root: process.cwd()
        }),
        
        // Assign the module and chunk ids by occurrence count. Ids that are used often get lower (shorter) ids.
        // This make ids predictable, reduces total file size and is recommended.
        // preferEntry (boolean) give entry chunks higher priority. This make entry chunks smaller but increases the overall size. (recommended)
        new webpack.optimize.OccurrenceOrderPlugin(true/*preferEntry*/),
        
        // 提取common模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'echarts']
        }),
        
        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: false,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,
            'process.env': {
                BABEL_ENV: JSON.stringify('production'),
                NODE_ENV: JSON.stringify('production')
            },
        }),
        
        new styleLintPlugin({
            configFile: path.join(__dirname, '/.stylelintrc'),
            quiet: false
        }),
        
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), '/app/dist/sms.html'),
            template: path.join(process.cwd(), '/src/template.html'),
            favicon: path.join(process.cwd(), '/src/layout/header/img/logo-journey.png'),
            inject: false,
            publicPath: LINKS.ORIGIN + LINKS.WEB_BASE,
            production: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta',
            minify: {
                caseSensitive: true,
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true
            }
        }),
        
        // 抽取组件外的样式到main.[hash:6].css 以便浏览器缓存,
        new ExtractPlugin('sms-[name]-[hash:6].css'),
        
        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),
        
        new webpack.optimize.MinChunkSizePlugin({
            name: 'main',
            minChunkSize: 5120, // ~5kB
        })
    ],
    
    
    /**
     * loaders
     */
    module: {
        rules: [
            {
                test: /\.scss$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                loader: 'stylelint-loader'
            },
            {
                test: /\.(vue|js)$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                loader: 'eslint-loader',
                options: {
                    env: {'es6': true}
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
                options: {
                    extractCSS: true,
                    preserveWhitespace: false
                }
            },
            // scss loader
            {
                test: /\.scss$/,
                loader: ExtractPlugin.extract({
                    use: 'css-loader?minimize!sass-loader',
                    fallback: 'vue-style-loader'
                })
            },
            // less loader
            {
                test: /\.less$/,
                loader: ExtractPlugin.extract({
                    use: 'css-loader?minimize!less-loader',
                    fallback: 'vue-style-loader'
                })
            },
            // 图片loader
            {
                test: /\.(jpe?g|gif|svg|png)$/i,
                loader: 'url-loader',
                query: {
                    limit: '10240',
                    name: 'images/sms-[name].[hash:4].[ext]'
                }
            },
            // font loader
            {
                test: /\.(ttf|eot|woff|svg)$/i,
                loader: 'url-loader',
                options: {
                    name: 'fonts/sms-[name].[hash:4].[ext]'
                }
            }
        ]
    }
};
