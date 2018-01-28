/**
 * entry
 */
require('./common/scss/index.scss');
require('./common/fonts/iconfont');

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from './routes.js'
import Plugins from './common/vue-plugin'
import Model from 'web-model'
import LINKS from './LINKS'
import rootStore from './common/vuex/rootStore'
import {CLEAR_USER_INFO} from './common/vuex/mutationTypes'
import {SIGN_IN, SET_AUTH_LOCK} from './common/vuex/actionTypes'
import {RECOVER_USER_INFO} from './common/vuex/actionTypes'


/**
 * Vue 开发选项
 */
if (process.env.NODE_ENV !== 'production') {
    Vue.config.devtools = true;
    Vue.config.productionTip = false;
}

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Plugins);
const store = new Vuex.Store(rootStore);

/**
 * storage event listener
 */
window.addEventListener('storage', function (e) {
    if (e.key === CLEAR_USER_INFO) {
        store.commit(CLEAR_USER_INFO);
        location.href = LINKS.login;
    }
});


/**
 * 路由配置
 */
const necessaryRoutes = routes.necessaryRoutes;
const routesGroup = routes.routesGroup;
const router = new VueRouter({
    mode: 'history',
});
router.addRoutes(necessaryRoutes);
router.beforeEach((to, from, next) => {
    // if(location.href.indexOf('/login/account') === -1){
    //     // 这里用到的 key 和小电商里相同，切勿随意更改
    //     let userJSONStr = to.query['user'];
    //     let resetKey = to.query['key'];
    //     // user info check
    //     if (userJSONStr) {
    //         // user: {authorization, email, id, isAdmin, loginCount, userName}
    //         store.dispatch(SIGN_IN, JSON.parse(userJSONStr));
    //         let newQuery = Object.assign({}, to.query);
    //         delete newQuery['user'];
    //         if (JSON.parse(userJSONStr).email === 'develop@qdum.com') {
    //             router.addRoutes(routesGroup);
    //         }
    //         next(Object.assign({}, to, {query: newQuery}));
    //     } else {
    //         if (!store.state.user.authorization) {
    //             store.dispatch(RECOVER_USER_INFO);
    //             if (store.state.user.email === 'develop@qdum.com') {
    //                 router.addRoutes(routesGroup);
    //                 next(Object.assign({}, to))
    //             }
    //             if (!store.state.user.authorization && !resetKey) {
    //                 console.info(`没有token, 访问需要权限的视图: ${to.name}, 跳转到登录`);
    //                 if (location.href !== LINKS.login) {
    //                     store.commit(CLEAR_USER_INFO);
    //                     location.href = LINKS.login;
    //                 }
    //             }
    //         }
    //         if (store.state.user.isAdmin == 1) {
    //             store.dispatch(RECOVER_USER_INFO);
    //             console.info(`没有token, 访问需要权限的视图: ${to.name}, 跳转到登录`);
    //             if (location.href !== LINKS.login) {
    //                 location.href = `${LINKS.ADMIN_BASE}/?&user=${JSON.stringify(store.state.user)}`;
    //             }
    //         }
    //         if (to.matched[0]) {
    //             document.title = to.matched[0].meta.name;
    //         } else {
    //             console.log(to);
    //             next(Object.assign({}, to))
    //         }
    //     }
    // }
        next()


});
// router.afterEach(route => {});


/**
 * Model settings
 */
let errorCount = 0;
Model.use({
    beforeEach: function (next) {
        if (errorCount >= 3) {
            app.$toast('网络异常，请检查网路连接或刷新尝试');
            return next(false);
        }

        // bear the jwt token
        // if(location.href.indexOf('/login/account') === -1) {
        //     if (store.state.user.authorization)
        //         this.set('Authorization', 'Bearer ' + store.state.user.authorization);
        //     else {
        //         console.info(`没有token访问需要权限的接口: ${this.url}, 跳转到登录`);
        //         store.dispatch(SET_AUTH_LOCK, {title: '需要登录', message: '尚未登录或身份信息过期，请前往登录'});
        //         store.commit(CLEAR_USER_INFO);
        //         if (location.href !== LINKS.login) {
        //             location.href = LINKS.login;
        //         }
        //     }
        // }

        next();
    },
    afterEach: function (err, res) {

        // response validation
        // if (err) {
        //     errorCount++;
        //
        //     if (err.status === 401) {
        //         console.error(`访问需要权限的接口401: ${this.method} ${this.url}`);
        //         store.commit(CLEAR_USER_INFO);
        //         store.dispatch(SET_AUTH_LOCK, {title: '需要登录', message: '尚未登录或身份信息过期，请前往登录'});
        //     } else if (err.status === 403) {
        //         console.warn(`访问接口权限不足: ${this.method} ${this.url}`);
        //         store.dispatch(SET_AUTH_LOCK, {
        //             title: '权限不足',
        //             message: '不能访问没有授权的接口'
        //         });
        //     } else if (res && res.body && res.body.message) {
        //         app.$toast(res.body.message, 'error');
        //     }
        //
        //     return false;
        // }

        if (res.body.code !== 200) {
            console.info('服务器返回code ' + res.body.code, this.url);
            app.$toast(res.body.message);
            return false;
        }

        errorCount = 0;
    }
});


/**
 * Start
 */
const app = new Vue({
    el: '#app',
    store,
    render: h => (<router-view></router-view>),
    router
});
