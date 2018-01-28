/**
 * Created by naeemo on 2017/4/7.
 */

// journey开始前校验 相关
export const DIGEST_VALIDATION_TASK = 'DIGEST_VALIDATION_TASK ';

// common
export const RECOVER_USER_INFO = 'RECOVER_USER_INFO';
export const SIGN_IN = 'SIGN_IN';           // 主动登录
export const SIGNED_IN = 'SIGNED_IN';       // 被动登录（其他标签页登录时，解锁当前视图）
export const SIGN_OUT = 'SIGN_OUT';         // 主动登出
export const SET_AUTH_LOCK = 'SET_AUTH_LOCK';