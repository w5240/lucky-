/**
 * Created by naeemo on 2017/3/29.
 */

import Model from 'web-model'
import {gate, admin} from '../../LINKS'

export default new Model({
    base: admin + '/api/manage/v1',
    api: {
    
        /**
         * 登录
         * @param email
         * @param password
         * @return {Request|*}
         */
        login(email, password) {
            return this.request
                .post('/account/login')
                .escape()
                .send({
                    email,
                    password
                })
        },
        cheatLogin(email){
            return this.request
                .get('/account/cheatLogin')
                .query({
                    email
                })
        },

    
        /**
         * 更新密码
         * @param email
         * @param newPassword
         * @param oldPassword
         * @return {Request|*}
         */
        updatePassword(email, oldPassword, newPassword) {
            return this.request
                .post(gate + '/api/account/changePwd')
                .send({
                    email,
                    newPassword,
                    oldPassword
                })
        },
    
    
        /**
         * 忘记密码，申请重置邮件
         * @param email
         * @return {Request|*}
         */
        requestResetPasswordMail(email) {
            return this.request
                .post(gate + '/api/account/resetPwd/initSms')
                .escape()
                .send({email})
        },

        /**
         * 重置密码
         * @param key
         * @param newPassword
         * @return {Request|*}
         */
        resetPassword(key, newPassword){
            return this.request
                .post(gate + '/api/account/resetPwd/finish')
                .escape()
                .send({key, newPassword})
        }
    }
});
