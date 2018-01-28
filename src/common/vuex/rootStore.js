
/**
 * Created by naeemo on 2017/4/25.
 */

import {CLEAR_USER_INFO, AUTH_LOCK, SET_USER_INFO} from "./mutationTypes";
import {SET_AUTH_LOCK, RECOVER_USER_INFO, SIGN_IN, SIGN_OUT, SIGNED_IN} from "./actionTypes";
import Cookies from "js-cookie";
import {LocalStorage} from "../utils/storage";
import {DOMAIN} from "../../LINKS";

//区分开各环境下的cookie避免冲突
const USER_INFO_SESSION_KEY = String(process.env.NODE_ENV).toUpperCase() + '_USER_INFO';
// const USER_INFO_SESSION_CONFIG = String(process.env.NODE_ENV).toUpperCase() + '_USER_INFO';
const USER_INFO_SESSION_CONFIG = {
    // journey和"小电商"使用了不同的子域名，可以各自保存各自的cookie
    // 这样用户就可以在同一个浏览器里同时登录小电商和journey了
    domain: DOMAIN
};

export default {
    state: {
        user: {
            id: '',
            email: '',
            userName: '',
            authorization: '',
            isAppreciationTemplate: '',
            isTemplateShop: '',
            isAdmin: '',
            from: '',
        },
        authLock: {
            title: '',
            message: ''
        }
    },
    mutations: {
        [SET_USER_INFO](state, {id, email, isTemplateShop, isAppreciationTemplate, userName, authorization, isAdmin, from}) {

            if (id) state.user.id = id;
            if (email) state.user.email = email;
            if (userName) state.user.userName = userName;
            if (authorization) state.user.authorization = authorization;
            state.user.isTemplateShop = isTemplateShop;
            state.user.isAppreciationTemplate = isAppreciationTemplate;
            state.user.isAdmin = isAdmin;
            state.user.from = from;
        },
        [CLEAR_USER_INFO](state) {
            state.user = {
                id: '',
                email: '',
                userName: '',
                authorization: '',
                isAppreciationTemplate: '',
                isTemplateShop: '',
                isAdmin: '',
                from:'',
            };
        },
        [AUTH_LOCK](state, {title = '', message = ''}) {
            state.authLock.title = title;
            state.authLock.message = message;
        }
    },
    actions: {
        [RECOVER_USER_INFO]({commit}) {
            const user = Cookies.getJSON(USER_INFO_SESSION_KEY);
            if (user) {
                user.from = 'sms';
                commit(SET_USER_INFO, user);
                return user;
            }
        },
        // 主动登入
        [SIGN_IN]({commit}, user) {
            // 1. 设置登录状态、cookie
            user.from = 'sms';
            commit(SET_USER_INFO, user);
            Cookies.set(USER_INFO_SESSION_KEY, user, USER_INFO_SESSION_CONFIG);
            // 2. 通知其他标签页 'SIGNED_IN'
            LocalStorage.set(SIGNED_IN, user);
            LocalStorage.set(AUTH_LOCK, {});
        },
        // 被动登录（其他标签页登录时，解锁当前视图）
        [SIGNED_IN]({commit}, user) {
            // 设置登录状态
            commit(SET_USER_INFO, user);
        },
        // 主动登出
        [SIGN_OUT]({commit}) {
            // 1. 清除登录状态、清除cookie;
            commit(CLEAR_USER_INFO);
            Cookies.remove(USER_INFO_SESSION_KEY, USER_INFO_SESSION_CONFIG);
            // 2. 通知其他标签页 'AUTH_LOCK'
            LocalStorage.set(SIGNED_IN, '');
            LocalStorage.set(AUTH_LOCK, {
                title: '需要登录',
                message: '您已登出，请重新登录'
            });
        },
        // 锁定当前视图（其它标签页登出导致的被动登出/访问接口4xx 等等）
        [SET_AUTH_LOCK]({commit, state}, {title = '', message = ''} = {}) {
            commit(AUTH_LOCK, {title, message});
        }
    }
}
