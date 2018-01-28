<template>
    <div class="account">
        <header class="header" :class="$route.name==='home'?'home':''">
            <a class="header-logo">
                <img src="./../../layout/header/img/beta-logo.png" alt="logo">
            </a>
            <div class="operations">
                <div class="operation hidden-menu-trigger">
                    <span class="user-email">Welcome&nbsp;,&nbsp;{{email}}</span>
                    <span class="icon icon-profile"></span>
                    <div class="hidden-menu">
                        <ul>
                            <li class="user-log-out border" @click="resetPassword">修改密码</li>
                            <li class="user-log-out icon icon-power-off log-out-btn log-out" @click="logout">登出
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <div class="side-menu">
            <!--<div :class="['menu-title', menu.title.className, {'active': currentModule === menu.name}]">-->
            <!--{{menu.title.text}}-->
            <!--</div>-->
            <ul>
                <router-link class="menu-child" tag="li" v-for="child in menu" :to="child.link"
                             v-text="child.text" :key="child.text"></router-link>
            </ul>
        </div>
        <div class="route">
            <router-view></router-view>
        </div>
        <confirm title="更改密码" @confirm="updatePassword" @cancel="cancelResetPassword" v-if="resetting_password">
            <validate ref="resetPasswordForm" lazy>
                <div class="form-field">
                    <label for="old" class="label">原密码</label>
                    <input type="password" id="old" class="input-field" v-model="oldPassword"
                           required minlength="8" maxlength="20" data-tip="允许8-20个字符,且不可为空">
                </div>
                <div class="form-field">
                    <label class="label">新密码</label>
                    <password v-model="newPassword"></password>
                </div>
            </validate>
        </confirm>
    </div>
</template>
<script type="text/babel">
    import {login} from '../../LINKS'
    import accountService from '../../common/model/accountModel'
    export default{
        data(){
            return {
                email:'',
                resetting_password:false,
                oldPassword:'',
                newPassword:'',
                login,
                menu:[{
                        link:{name:'accountLogin'},
                        text:'子账号登录',
                    },{
                    link:{name:'statisticReport'},
                    text:'账号统计报告',
                }]
           }
        },
        mounted(){
            this.email = this.$route.params.email;
        },
        methods:{
            resetPassword() {
                this.oldPassword = '';
                this.newPassword = '';
                this.resetting_password = true;
            },
            cancelResetPassword() {
                this.resetting_password = false;
            },
            updatePassword() {
                // validate
                if (this.$refs.resetPasswordForm.bad()) return;

                accountService
                    .updatePassword(this.email, this.oldPassword, this.newPassword)
                    .then(() => {
                        this.$toast('密码修改成功', 'success');
                        this.resetting_password = false;
                    })

            },
            logout() {
//                this.$store.dispatch(SIGN_OUT);
                location.href = LINKS.login;
            },
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";
    .account {
        height:100%;
        width:100%;
        .header {
            $main-bg: #f2f2f2;

            position: absolute;
            box-sizing: content-box;
            top: 0;
            left: 0;
            right: 0;
            z-index: $index-header;
            width: 100%;
            height: $header-height;
            min-width: 1100px;

            &:not(.home) {
                background: $header-bg;
                border-bottom: 5px solid #0cc2a9;
            }
            &.home {
                background: rgba(0, 0, 0, 0.5);
            }

            .header_icon {
                font-size: 30px;
                display: inline-block;
                color: $sms;
                position: relative;
                left: -7px;
                top: 6px;
            }
            @include user-select(none);
            @at-root {
                .contact-theme &,
                .material-theme & {
                    border-bottom: 4px solid $contact;
                }

                .journey-theme & {
                    border-bottom: 5px solid #0cc2a9;
                }
            }

            .header-logo {
                float: left;
                width: 160px;
                height: 100%;
                margin-left: 20px;
                margin-top: 2px;

                img {
                    display: inline-block;
                    height: auto;
                    width: 135px;
                    margin-top: 3px;
                }
            }

            .operations {
                float: right;
                margin-right: 12px;
                white-space: nowrap;

                .c-pointer {
                    cursor: pointer;
                }
                .operation {
                    position: relative;
                    display: inline-block;
                    padding: 0 10px 0 5px;
                    font-size: 16px;
                    line-height: 60px;
                    color: white;
                    z-index: $index-header;

                    .user-email, .user-email + span {
                        font-size: 14px;
                    }
                    &.icon-power-off {
                        cursor: pointer;
                        @include transition(color .2s ease);

                        &:hover {
                            color: $red;
                        }
                    }
                }

                .hidden-menu {
                    right: 0;
                    top: 50px;
                    @include transform-origin(right top);
                    width: 100px;
                    height: 100px;
                    color: white;

                    ul:not(.user-remind) li {
                        cursor: pointer;
                    }
                }

                .user-remind {
                    width: 106px;
                    height: 246px;
                    float: left;
                    background: #00bba4;
                    border: 1px solid #00bba4;
                    border-radius: 3px 0 0 3px;
                    transform: translate(-1px, -1px);

                    .divider {
                        font-size: 14px;
                        color: white;
                        height: 82px;
                        width: 105px;
                        text-align: center;
                        line-height: 1.5;
                        box-sizing: border-box;
                        padding: 22px 0 0 0;

                        p {
                            color: #9dded2;
                        }
                        &:hover {
                            background: none;
                        }
                    }
                }

                .user-help {
                    display: block;
                    line-height: 35px;

                    span {
                        color: #333;
                    }
                    &:hover span {
                        color: black;
                    }
                    &.disabled {
                        cursor: not-allowed;
                        background: $main-bg;
                    }
                }
            }
            .user-log-out {
                display: block;
                line-height: 25px;
                text-align: center;

                &.border {
                    margin-top: 17px;
                }
                &.log-out {
                    margin: 15px 0 3px;
                    padding: 0 15px;
                }
            }
        }
        .side-menu {
            $menu-item-height: 50px;

            @include box-sizing();
            position: absolute;
            left: 0;
            top: 60px;
            bottom: 0;
            height: 100%;
            width: $sidebar-width;
            overflow-y: auto;
            background-color: $header-bg;

            .menu-title {
                position: relative;
                padding-left: 1.5em;
                height: $menu-item-height;
                line-height: $menu-item-height;
                color: $color-light-content;
                font-size: 16px;
                cursor: default;

                &.active {
                    color: #fff;
                }

                &:before {
                    display: inline-block;
                    font-family: "icon";
                    margin-right: 5px;
                    font-size: 20px;
                    line-height: $menu-item-height;
                    font-style: normal;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                &.menu-user {
                    &:before {
                        content: '\e624';
                    }
                }
                &.menu-module {
                    &:before {
                        content: '\e651';
                    }
                }
                &.menu-manage {
                    &:before {
                        content: '\e65f';
                    }
                }
            }

            .menu-subtitle {
                padding-left: 2.5em;
                height: $menu-item-height/2;
                line-height: $menu-item-height/2;
                color: $sms-hover;
                cursor: default;
            }

            .menu-child {
                height: $menu-item-height - 10;
                padding-left: 50px;
                line-height: $menu-item-height - 10;
                color: $color-gray-content;
                cursor: pointer;
                @include transition();

                &:hover,
                &.router-link-active {
                    color: #fff;
                    background-color: lighten($header-bg, 8%);
                }
            }

        }
        .route{
            float: left;
            padding:20px;
            margin: $header-height 0 0 $sidebar-width;
            height:calc( 100% - 60px);
            width:calc(100% - 190px);
        }
    }
</style>