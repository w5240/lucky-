/**
 * Created by naeemo on 16/7/18.
 */

const DEBUG = process.env.NODE_ENV === 'development';
const app = require('koa')();
const body = require('koa-better-body');
const serve = require('koa-static');
const Router = require('./router');
const log = require('./devLog');


app.use(log);

/**
 * static resources serving, use webpack-dev-middleware in development environment
 */
if (DEBUG) {
    const koaWM = require('koa-1.x-webpack-middleware');
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.conf.dev.js');
    webpackConfig.entry['webpack-hot-middleware/client'] = 'webpack-hot-middleware/client';
    webpackConfig.entry['webpack/hot/dev-server'] = 'webpack/hot/dev-server';
    const compiler = webpack(webpackConfig);
    app.use(koaWM.koaWebpackDev(compiler, {
        noInfo: false,
        quiet: false,
        watchOptions: {
            aggregateTimeout: 300
        },
        hot: false,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    })).use(koaWM.koaWebpackHot(compiler))
} else {
    app.use(serve(__dirname + '/dist', {
        maxage: 0, // milliseconds
        cache: false
    }));
}

/**
 * body
 */
app.use(body());


/**
 * router
 */
app.use(Router.routes());


// start
app.listen(8008);

