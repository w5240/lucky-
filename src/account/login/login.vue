<template>
    <div class="journey-sign-in-page" v-if="$route.name ==='login'">
        <div class="sign-in-form" :class="mode">
            <div class="journey-builder-icon">
                <transition mode="out-in" name="validating" @after-leave="leave">
                    <div class="journey-account-form-panel"
                         v-if="mode === 'form' || mode === 'reset' || mode === 'authorty'" key="form">
                        <div class="sign-in-form-content">
                            <!-- 登录 -->
                            <template v-if="mode === 'form'">
                                <div class="account-field">
                                    <input type="text" id="email-address" v-model.trim="loginForm.email" formnovalidate
                                           autocomplete="off" aria-autocomplete="none" maxlength="64" tabindex="1">
                                    <label for="email-address">邮箱地址</label>
                                </div>
                                <div class="account-field">
                                    <input type="password" id="user-password" v-model="loginForm.password" class="slim"
                                           @keydown.enter="login" maxlength="20" autocomplete="off"
                                           aria-autocomplete="none"
                                           @change="passwordInput" formnovalidate tabindex="2">
                                    <label for="user-password">密码</label>
                                    <a class="extra-action-link" @click="forgetPassword">忘记密码?</a>
                                </div>
                                <button type="button" class="submit-btn" @click.stop.prevent="login" tabindex="3"
                                        :disabled="saving">
                                    <svg>
                                        <circle v-if="saving" cx="10" cy="9" r="7" stroke-dasharray="15 20"></circle>
                                        <path v-if="!saving" d="M0,8 L20,8"></path>
                                        <path v-if="!saving" d="M10,0 L20,8 10,16"></path>
                                    </svg>
                                    登录
                                </button>
                            </template>
                            <!--特殊账号选择-->
                            <template v-if="mode === 'authorty'">
                                <div class="account-select">
                                    <selector :options="userOption" v-model="rootEmail"></selector>
                                </div>
                                <button type="button" class="submit-btn" @click.stop.prevent="rootLogin" tabindex="3"
                                        :disabled="saving">
                                    <svg>
                                        <circle v-if="saving" cx="10" cy="9" r="7" stroke-dasharray="15 20"></circle>
                                        <path v-if="!saving" d="M0,8 L20,8"></path>
                                        <path v-if="!saving" d="M10,0 L20,8 10,16"></path>
                                    </svg>
                                    登录
                                </button>
                            </template>
                            <!-- 找回密码 -->
                            <template v-if="mode === 'reset'">
                                <div class="account-field" :style="mode ==='reset'?'margin-top:60px':''">
                                    <input type="text" id="passwordResetEmail" v-model.trim="passwordResetEmail"
                                           class="slim"
                                           autocomplete="off" aria-autocomplete="none" formnovalidate tabindex="1"
                                           maxlength="64">
                                    <label for="email-address">邮箱地址</label>
                                    <a class="extra-action-link" @click="backToLogin">返回登录</a>
                                </div>
                                <button type="button" class="submit-btn" @click.stop.prevent="reset" tabindex="2"
                                        :disabled="saving">
                                    <svg>
                                        <circle v-if="saving" cx="10" cy="9" r="7" stroke-dasharray="15 20"></circle>
                                        <path v-if="!saving" d="M0,8 L20,8"></path>
                                        <path v-if="!saving" d="M10,0 L20,8 10,16"></path>
                                    </svg>
                                    找回密码
                                </button>
                            </template>
                        </div>
                    </div>
                    <div class="journey-account-form-panel" v-if="mode === 'validating'" key="validation">
                        <h2 class="start-up-validation-title"> {{validationTitle}} </h2>
                        <ol class="validation-list">
                            <li :class="{'checking': checking_index === 0, 'checked': checking_index > 0}">
                                <h3>DMDelivery SOAP API 链接状态 </h3>
                                <p>活动名称：{{checkResult.dmdActivityName}}</p>
                            </li>
                            <li :class="{'checking': checking_index === 1, 'checked': checking_index > 1}">
                                <h3>SFTP 服务器链接状态</h3>
                                <p>服务器地址：{{checkResult.sftpHost}}；用户名：{{checkResult.sftpUserName}}</p>
                            </li>
                            <li :class="{'checking': checking_index === 2, 'checked': checking_index >  2}">
                                <h3>SMS API 连接状态</h3>
                                <p>活动名称：短信测试；签名：【威勃庞尔】</p>
                            </li>
                        </ol>
                    </div>
                    <confirm title="重置密码" @confirm="confirmResetPassword" @cancel="cancelResetPassword"
                             v-if="mode === 'resetting'">
                        <validate ref="resetPasswordForm">
                            <div class="form-field">
                                <label for="new1" class="label">新密码</label>
                                <input type="password" id="new1" class="input-field" v-model="resetPassword"
                                       required minlength="8" maxlength="20" no-ch-char>
                            </div>
                            <div class="form-field">
                                <label for="new2" class="label">重复密码</label>
                                <input type="password" id="new2" class="input-field" v-model="resetPasswordAgain"
                                       required minlength="8" maxlength="20" no-ch-char>
                            </div>
                        </validate>
                    </confirm>
                </transition>
            </div>
            <p class="copyright"><a href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备15019704号-6</a>&nbsp;copyright&copy;1999-2016 dmacloud All rights reserved.
            </p>
        </div>
    </div>
    <div v-else>
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascript-6">

    import {RECOVER_USER_INFO, SIGN_IN} from '../../common/vuex/actionTypes'
    import accountModel from '../../common/model/accountModel'
    import userModel from './../userModel'
    import LINKS from '../../LINKS'

    export default {
        data() {
            return {
                mode: 'form',     // form, validating, leaving, reset, resetting
                loginForm: {
                    email: '',
                    password: '',
                },
                checkResult: {
                    dmdActivityName: '',
                    sftpHost: '',
                    sftpUserName: ''
                },
                checking_index: 0, // 0 1 2 3
                passwordResetEmail: '',
                passwordResetKey: '',
                resetPassword: '',
                resetPasswordAgain: '',
                rootEmail: '',
                userOption: [],
                saving: false
            }
        },
        computed: {
            validationTitle() {
                if (this.checking_index < 3)
                    return '启程前检查...(' + (this.checking_index + 1) + '/3)';

                return `检查完毕，所有连接状态正常即将进入平台...`;
            },
            user() {
                return this.$store.state.user;
            }
        },
        mounted() {
            // check for reset password enter
            if (this.$route.query.key) {
                this.mode = 'resetting';
                this.passwordResetKey = this.$route.query.key;
            } else {
                if (this.user.authorization === '')
                    this.$store.dispatch(RECOVER_USER_INFO);

                if (this.user.authorization) {
                    this.mode = 'leaving';
                }
            }
        },
        methods: {
            passwordInput(e) {
                let value = e.target.value;
                if (value !== '') {
                    value = value.replace(/^\s*/, '');
                    this.loginForm.password = value;
                    e.target.value = value;
                }
            },
            login() {
                if (this.saving) return;
                // validate
                if (this.loginForm.email === '') {
                    this.$toast('请填写邮箱地址', 'warn');
                    return;
                }
                this.loginForm.password = this.loginForm.password.replace(/^\s*/, '');
                if (this.loginForm.password === '') {
                    this.$toast('请填写密码', 'warn');
                    return;
                }
                if (this.loginForm.password.length < 8) {
                    this.$toast('密码应不少于 8 位', 'warn');
                    return;
                }
                if (this.loginForm.password.length > 20) {
                    this.$toast('密码长度不超过 20 位', 'warn');
                    return;
                }
                if (!/^([A-Za-z0-9]+[A-Za-z0-9_\-.]*[A-Za-z0-9]+|[A-Za-z0-9]+)@[A-Za-z0-9_\-]+\.[.A-Za-z0-9_\-]+$/.test(this.loginForm.email)) {
                    this.$toast('邮箱地址格式不对', 'warn');
                    return;
                }
                if (this.loginForm.email.replace(/@\.+$/, '').length >= 64) {
                    this.$toast('邮箱地址过长', 'warn');
                    return;
                }

                this.saving = true;
                // 尝试登录
                accountModel
                    .login(this.loginForm.email, this.loginForm.password)
                    .then(({body: {data: user}}) => {
                        // user: {authorization, email, id, isAdmin, loginCount, userName}
                        this.saving = false;
                        // 记录用户信息
                        user.from = 'sms';
                        if (user.isAuthorty !== 1) {
                            this.$store.dispatch(SIGN_IN, user);
                        } else {
                            this.mode = 'authorty';
                            this.userOption = user.user.map(user => {
                                return {name: user.loginName, id: user.loginName}
                            });
                            this.$router.push({name:'account', params:{email:this.loginForm.email}});

                            let userArr = JSON.stringify(this.userOption);
                            localStorage.setItem('userOption', userArr);

                            return
                        }
                        if (this.user.isAdmin == 1) {
                            this.mode = 'leaving';
                        } else {
                            // 过渡
                            if (user.loginCount === 1) {
                                this.mode = 'validating';
                                userModel
                                    .getUserTest(this.user.id)
                                    .then(({body: {data: {test}}}) => {
                                        this.checkResult.dmdActivityName = test.dmdActivityName;
                                        this.checkResult.sftpHost = test.sftpHost;
                                        this.checkResult.sftpUserName = test.sftpUserName;
                                        this.validate();
                                    })
                            } else {
                                this.mode = 'leaving';
                            }
                        }
                    })
                    .catch(e => {
                        this.saving = false;
                    });
            },
            rootLogin(){
                if (this.saving) return;
                this.saving = true;
                accountModel
                    .cheatLogin(this.rootEmail)
                    .then(({body: {data: user}}) => {
                        this.saving = false;
                        this.$store.dispatch(SIGN_IN, user);
                        if (user.loginCount === 1) {
                            this.mode = 'validating';
                            userModel
                                .getUserTest(this.user.id)
                                .then(({body: {data: {test}}}) => {
                                    this.checkResult.dmdActivityName = test.dmdActivityName;
                                    this.checkResult.sftpHost = test.sftpHost;
                                    this.checkResult.sftpUserName = test.sftpUserName;
                                    this.validate();
                                })
                        } else {
                            this.mode = 'leaving';
                        }
                    })
                    .catch(e => {
                        this.saving = false;
                    });

            },
            validate() {
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    this.checking_index++;
                    timer = setTimeout(() => {
                        clearTimeout(timer);
                        this.checking_index++;
                        timer = setTimeout(() => {
                            clearTimeout(timer);
                            this.checking_index++;
                            timer = setTimeout(() => {
                                clearTimeout(timer);
                                this.mode = 'leaving';
                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 2000)
            },
            forgetPassword() {
                this.mode = 'reset';
            },
            backToLogin() {
                this.mode = 'form';
            },
            reset() {
                if (this.saving) return;
                // validate
                if (this.passwordResetEmail === '') {
                    this.$toast('请填写邮箱地址', 'warn');
                    return;
                }
                if (!/^([A-Za-z0-9]+[A-Za-z0-9_\-.]*[A-Za-z0-9]+|[A-Za-z0-9]+)@[A-Za-z0-9_\-]+\.[.A-Za-z0-9_\-]+$/.test(this.passwordResetEmail)) {
                    this.$toast('邮箱地址格式不对', 'warn');
                    return;
                }
                if (this.passwordResetEmail.replace(/@\.+$/, '').length >= 64) {
                    this.$toast('邮箱地址过长', 'warn');
                    return;
                }
                this.saving = true;
                accountModel
                    .requestResetPasswordMail(this.passwordResetEmail)
                    .then(() => {
                        this.saving = false;
                        this.$toast('重置邮件已发送, 请注意查收', 'success');
                    })
                    .catch(e => {
                        this.saving = false;
                    })

            },
            cancelResetPassword() {
                this.$confirm('确定退出密码重置？', '退出后，您仍可以 尝试刷新 或 点击重置邮件内链接 来重新进入重置流程')
                    .then(yes => {
                        if (yes) this.mode = 'form';
                    })
            },
            confirmResetPassword() {
                if (this.saving) return;

                if (this.$refs.resetPasswordForm.bad()) return;

                if (this.resetPassword !== this.resetPasswordAgain) {
                    this.$toast('两次输入的密码不相同', 'warn');
                    return;
                }
                this.saving = true;
                accountModel
                    .resetPassword(this.passwordResetKey, this.resetPassword)
                    .then(() => {
                        this.saving = false;
                        this.mode = 'form';
                        this.$toast('密码重置成功', 'success');
                        this.$router.replace({name: 'login'});
                    })
                    .catch(e => {
                        this.saving = false;
                    })
            },
            leave() {
                if (this.user.isAdmin == 1) {
                    location.href = `${LINKS.ADMIN_BASE}/?&user=${JSON.stringify(this.$store.state.user)}`;
                } else if (this.mode === 'leaving') {
                    console.log('req to leaving')
                   this.$router.push({name: 'home'});
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";

    $transition_time: .8s;

    .journey-sign-in-page {
        height: 100vh;
        overflow: hidden;
        min-width: 900px;
        background: url("./../images/login-bg.jpg") no-repeat;
        @include background-size(cover);
        white-space: nowrap;
        // 登录视图
        .sign-in-form {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            height: 100%;
            width: 100%;
            text-align: center;

            &:after {
                content: '';
                display: inline-block;
                height: 100%;
                vertical-align: middle;
            }

            // 表单模式
            &.form {

            }
            // 即将跳转页面
            &.leaving {
                .journey-builder-icon {
                    right: 200px;
                    opacity: 0;
                }
                .journey-account-form-panel {
                    left: 200px;
                    opacity: 0;
                }
            }
            // 首次登录检查
            &.validating {
                .journey-builder-icon {
                    h1 {
                        top: 0;
                        opacity: 1;
                    }
                }

                .validating-enter {
                    top: -80px;
                    opacity: 0;
                }

                .validating-leave-to {
                    top: 200px;
                    opacity: 0;
                }
            }
        }

        .journey-builder-icon {
            position: relative;
            right: 0;
            opacity: 1;
            display: inline-block;
            vertical-align: middle;
            width: 1000px;
            height: 460px;
            margin-right: 145px;
            background: url("./../images/login-bg.png") no-repeat center;
            @include background-size(100%);
            @include transition(top $transition_time ease, opacity $transition_time ease, right $transition_time ease);
            @include user-select(none);

            @at-root .journey-account-form-panel {
                position: absolute;
                top: 120px;
                left: 550px;
                opacity: 1;
                display: inline-block;
                vertical-align: middle;
                text-align: left;
                white-space: nowrap;
                @include transition(left $transition_time ease, opacity $transition_time ease, top $transition_time ease);

                $label-width: 85px;
                $field-height: 45px;
                $field-width: 300px;

                // 登录表单校验容器
                .sign-in-form-content {
                    width: 350px;
                    margin: 30px 0 0;
                }

                .account-field {
                    position: relative;
                    margin-top: 35px;
                    line-height: $field-height - 25px;
                    @include border-radius(4px);

                    input[type="text"],
                    input[type="password"] {
                        height: $field-height - 25px;
                        border: none;
                        font-size: 12px;
                        letter-spacing: 1px;
                        font-weight: 600;
                        color: $color-content;
                        box-shadow: 1px 1px 24px #d2a8de;
                        @include border-radius(4px);

                        &:not(.slim) {
                            width: $field-width - $label-width;
                            padding: 13px 0 12px $label-width;
                        }

                        &.slim {
                            width: $field-width - $label-width - 72px;
                            padding: 13px 72px 12px $label-width;
                        }

                        &:focus {

                            + label {
                                font-size: 12px;
                                color: $sms;

                                &:after {
                                    content: '：';
                                }
                            }
                        }
                    }

                    label {
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: $field-height - 16px;
                        line-height: $field-height - 16px;
                        width: $label-width - 13px;
                        padding: 8px 0 8px 13px;
                        color: $color-gray-content;
                        font-size: 14px;
                        font-weight: normal;
                        @include transition();
                    }

                    .extra-action-link {
                        position: absolute;
                        right: 60px;
                        top: ($field-height - 16px)/2;
                        line-height: 16px;
                        color: $color-gray-content;
                        text-decoration: underline;
                        @include transition(color .2s ease);
                        cursor: pointer;

                        &:hover {
                            color: $color-light-content;
                        }
                    }
                }

                .account-select {
                    position: relative;
                    margin-top: 35px;
                    line-height: $field-height - 25px;
                    @include border-radius(4px);

                    .selector {
                        width: 80%;
                        margin-left: 3%;
                    }
                }

                .submit-btn {
                    display: inline-block;
                    position: relative;
                    overflow: hidden;
                    height: 50px;
                    width: 300px;
                    font-size: 16px;
                    margin-top: 35px;
                    line-height: $field-height;
                    vertical-align: top;
                    text-align: center;
                    border: none;
                    color: #06384f;
                    @include border-radius($field-height/2);
                    background: #02e3ca; /* 一些不支持背景渐变的浏览器 */
                    @include linear-gradient(top, #05fddd, #07c7ae);
                    white-space: nowrap;
                    cursor: pointer;
                    @include box-shadow(0 0 27px mix(#3b0848, #8600d3));
                    @include transition();

                    svg {
                        position: absolute;
                        right: 20px;
                        top: 17px;
                        width: 20px;
                        height: 17px;

                        circle,
                        path {
                            stroke-width: 2px;
                            stroke: #06384f;
                            stroke-linejoin: round;
                            stroke-linecap: round;
                            fill: none;
                        }

                        circle {
                            @include transform-origin(50%);
                            @include animation(rotating .5s linear infinite);
                        }
                        @keyframes rotating {
                            0% {
                                transform: rotate(0)
                            }
                            100% {
                                transform: rotate(360deg)
                            }
                        }
                    }

                    /*&:hover {*/
                    /*width: 112px;*/
                    /*padding-right: 30px;*/
                    /*}*/

                    &[disabled] {
                        cursor: progress;
                    }
                }

                // 校验视图
                .start-up-validation-title {
                    min-height: 120px;
                    width: 13em;
                    margin: 0 0 0 320px;
                    font-size: 30px;
                    line-height: 45px;
                    font-weight: normal;
                    color: white;
                    white-space: normal;
                    word-break: break-all;
                }

                .validation-list {
                    margin: 0 0 0 320px;
                    padding: 0;
                    white-space: nowrap;

                    li {
                        position: relative;
                        padding-left: 40px;
                        $list-item-size: 19px;

                        &.checking,
                        &.checked {
                            h3 {
                                color: white;

                                &:before {
                                    content: '';
                                    position: absolute;
                                    width: 9px;
                                    height: 9px;
                                    left: ($list-item-size - 9px)/2;
                                    top: ($list-item-size - 9px)/2;
                                    @include border-radius(100%);
                                    background-color: white;
                                }

                                &:after {
                                    display: inline-block;
                                    margin-left: 10px;
                                    font-family: "icon", sans-serif;
                                }
                            }
                        }

                        &.checking {
                            h3:after {
                                content: '\e62b';
                                font-size: 16px;
                                @include animation(rotating .6s linear infinite);
                            }
                        }
                        &.checked {
                            h3:after {
                                content: '\e60a';
                                font-size: 14px;
                                width: 16px;
                                height: 14px;
                                padding-top: 2px;
                                line-height: 14px;
                                text-align: center;
                                @include border-radius(8px);
                                background-color: white;
                                color: #050830;
                            }
                        }

                        // checker
                        &:before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: $list-item-size - 4px;
                            height: $list-item-size - 4px;
                            @include border-radius(100%);
                            border: 2px solid white;
                        }

                        + li {
                            &.checking,
                            &.checked {
                                &:after {
                                    border-left-color: white;
                                }
                            }

                            // 时间轴线
                            &:after {
                                content: '';
                                position: absolute;
                                top: -60px;
                                left: ($list-item-size - 3px)/2;
                                width: 0;
                                height: 60px;
                                border-left: 3px solid rgba(white, .3);
                            }
                        }
                    }

                    h3 {
                        margin: 0;
                        font-size: 20px;
                        font-weight: normal;
                        color: rgba(white, .4);
                    }

                    p {
                        padding: 5px 0 30px;
                        font-size: 16px;
                        font-weight: normal;
                        color: rgba(white, .3);
                    }
                }

            }
        }
        .copyright {
            position: absolute;
            bottom: 1rem;
            text-align: center;
            left: 0;
            color: $gray;
            white-space: nowrap;
            right: 0;

            a {
                color: $sms;
                text-decoration: underline;
            }
        }
    }

</style>
