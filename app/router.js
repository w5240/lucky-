'use strict';

const router = require('koa-router');

const index = require('./controllers/index');

/*
 * routers
 * */
const Router = router();

//渲染模板
Router
    .get('/', index.index)
    .get('/**', index.index);


module.exports = Router;