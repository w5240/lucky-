/**
 * Created by naeemo on 2016/12/1.
 */
// 主视口内含头部header

const Qdum = () => import(/* webpackChunkName: "account" */'./account/qdumAdmin/qdumAdmin.vue');
const App = () => import(/* webpackChunkName: "account" */'./layout/app.vue');
const Index = () => import(/* webpackChunkName: "account" */'./layout/index.vue');
const login = () => import(/* webpackChunkName: "account" */'./account/login/login.vue');
const account = () => import(/* webpackChunkName: "account" */'./account/login/account.vue');
const accountLogin = () => import(/* webpackChunkName: "account" */'./account/login/accountLogin.vue');
const statisticReport = () => import(/* webpackChunkName: "account" */'./account/login/statisticReport.vue');
const notFound = () => import(/* webpackChunkName: "account" */'./common/components/not-found.vue');
const home = () => import(/* webpackChunkName: "account" */'./account/home.vue');

const lucky = () => import(/* webpackChunkName: "account" */'./content/lucky.vue');

export default {
    necessaryRoutes: [
        {
            path: '/setting',
            name: 'setting',
            meta: {name: '设置'},
            redirect: '/setting/sendRecord',
            component: App,
            children: [
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            children:[{
                path: 'account/:email',
                name: 'account',
                component: account,
                redirect:'/login/account/:email/accountLogin',
                children:[
                    {
                        path: 'accountLogin',
                        name: 'accountLogin',
                        component: accountLogin,
                    }, {
                        path: 'statisticReport',
                        name: 'statisticReport',
                        component: statisticReport,
                    }
                ]
            }]
        },
        {
            path: '/reset-password',
            name: 'passwordReset',
            component: login
        },
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/',
            name: 'index',
            component: Index,
            redirect: '/lucky',
        },
        {
            path: '/lucky',
            name: 'lucky',
            component: lucky,
        },
        {
            path: '*',
            component: notFound
        },
    ],
};