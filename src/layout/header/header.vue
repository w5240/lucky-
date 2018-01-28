<template>
    <div>
        <!---->
        <header class="header" :class="$route.name==='home'?'home':''">
            <a :href="HOME_LINK" class="header-logo">
                <img src="./img/beta-logo.png" alt="logo">
            </a>
            <div class="header-link" v-if="$route.name !=='home' && $route.matched[0].name !== 'setting'">
                <svg>
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12,6 L12,18"></path>
                    <path d="M6,12 L12,18 18,12"></path>
                </svg>
                {{$route.matched[0].meta.name}}
                <div class="link-down">
                    <a :href="ORIGIN_LINK+'/contact'" class="link-contact"></a>
                    <a :href="ORIGIN_LINK+'/material'" class="link-material"></a>
                    <a class="link-sms" @click="nav_emit('smsList')"></a>
                    <a class="link-mms" @click="nav_emit('mmsList')"></a>
                </div>
            </div>
            <div class="header-nav">
                <router-link v-for="(name, routerName) in routerLinks" key="routerName"
                             @click.native="nav_emit(routerName)"
                             :to="{name: routerName}" v-text="name"></router-link>
            </div>
            <div class="operations">
                <div class="operation hidden-menu-trigger">
                    <span class="user-email">Welcome&nbsp;,&nbsp;{{companyName}}</span>
                    <span class="icon icon-profile"></span>
                    <div class="hidden-menu">
                        <ul class="user-remind">
                            <li class='divider readonly'><strong v-text="smsSurplus"></strong>
                                <p>● 短信余量</p></li>
                            <li class='divider readonly'><strong v-text="smsAbroadSurplus"></strong>
                                <p>● 海外短信余量</p></li>
                            <li class='divider readonly'><strong v-text="mmsSurplus"></strong>
                                <p>● 彩信余量</p></li>
                        </ul>
                        <ul>
                            <li class="user-help readonly" @click="jumpTo(link.service)"><span
                                    target="_blank">在线客服</span></li>
                            <li class="user-help readonly" @click="jumpTo(link.videos)"><span
                                    target="_blank">视频教程</span></li>
                            <li class="user-help readonly" @click="jumpTo(false)"><span target="_blank">API文档</span>
                            </li>
                            <li class="user-help readonly" @click="jumpTo(link.help)"><span target="_blank">使用帮助</span>
                            </li>
                            <li class="user-help readonly" @click="jumpTo('http://dmavip.ufile.ucloud.com.cn/dmacloud/DMACLOUD 平台操作手册.pdf')"><span
                                    target="_blank">DMACLOUD操作手册</span>
                            </li>
                            <li class="user-log-out border" @click="resetPassword">修改密码</li>
                            <li class="user-log-out icon icon-power-off log-out-btn log-out" @click="logout">&nbsp登出
                            </li>
                        </ul>
                    </div>
                </div>
                <span class="operation hidden-menu-trigger" @click="isSetting">
                    <span class="icon" :class="$route.name === 'home' ? ' icon-setting':'icon-arrow-left'"
                          style="font-size: 14px"></span>
                </span>
            </div>
        </header>
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
    import smsModel from '../../common/model/smsModel'
    import LINKS from '../../LINKS'
    import {NAV_LINKS} from '../../routes'
    import {CLEAR_USER_INFO} from '../../common/vuex/mutationTypes'
    import {SIGN_OUT} from '../../common/vuex/actionTypes'
    import accountService from '../../common/model/accountModel'

    export default {
        data() {
            return {
                HOME_SETTING: LINKS.setting,
                HOME_LINK: LINKS.home,
                ORIGIN_LINK: LINKS.ORIGIN,
                routerLinks: [],
                resetting_password: false,
                showPassword: false,
                oldPassword: '',
                newPassword: '',
                smsSurplus: '',
                smsAbroadSurplus: '',
                companyName: '',
                mmsSurplus: '',
                link: {
                    // FIXME release config
                    service: 'https://webpower.kf5.com/kchat/4341?from=%25E5%259C%25A8%25E7%25BA%25BF%25E6%2594%25AF%25E6%258C%2581',
                    shop: 'https://dmavip.com/shop/prepaid',
                    setting: 'https://dmavip.com/setting/accountSet',
                    videos: 'http://dmavip.ufile.ucloud.com.cn/短信平台操作指南.mp4',
                    help: 'https://webpower.kf5.com/forum/category/7296/',
                    api: 'https://dmavip.com/home/api.html'
                }
            }
        },
        computed: {
            userName() {
                return this.$store.state.user.userName;
            },
            email() {
                return this.$store.state.user.email;
            }
        },
        mounted() {
//            const match = this.$route.fullPath.match(/^\/([^\/]*)/i);
//            let type = match && match[1];
            let type = this.$route.matched[0].name;
            this.routerLinks = NAV_LINKS[type];
            smsModel
                .getSurplus(this.userName)
                .then(({body: {data}}) => {
                    this.smsSurplus = data.profile.smsSurplus;
                    this.smsAbroadSurplus = data.profile.smsAbroadSurplus;
                    this.mmsSurplus = data.profile.mmsSurplus;
                    this.companyName = data.profile.companyDto.companyName;
                })
        },
        watch: {
            '$route'(route) {
                const match = route.fullPath.match(/^\/([^\/]*)/i);
                let type = match && match[1];
                this.routerLinks = NAV_LINKS[type];
            }
        },
        methods: {
            jumpTo(link) {
                if (link) {
                    window.open(link)
                }
            },
            isSetting() {
                if (this.$route.matched[0].name === 'setting') {
                    this.$router.push({name: 'home'})
                } else if (this.$route.name === 'home') {
                    this.$router.push({name: 'setting'});
                } else {
                    this.$router.push({name: 'home'})
                }
            },
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
                this.$store.dispatch(SIGN_OUT);
                location.href = LINKS.login;
            },
            nav_emit(route_name) {
                if (this.$route.name === route_name) {
                    this.$root.$emit('refresh');
                } else {
                    this.$router.push({name: route_name})
                }
            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

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
            margin-left:20px;
            margin-top:2px;

            img {
                display: inline-block;
                height: auto;
                width: 135px;
                margin-top: 3px;
            }
        }

        .header-link {
            float: left;
            min-width: 80px;
            padding: 0 12px 0 10px;
            height: 100%;
            color: white;
            text-align: center;
            font-size: 14px;
            line-height: $header-height;
            cursor: pointer;
            background-color: $sms;

            @at-root {
                .contact-theme &,
                .material-theme & {
                    background-color: $contact;
                }

                .journey-theme & {
                    background-color: #0cc2a9;
                }
            }

            svg {
                display: inline-block;
                vertical-align: top;
                width: 24px;
                height: 24px;
                margin-top: ($header-height - 24px) / 2;
                cursor: default;

                circle {
                    stroke: #fff;
                    stroke-width: 2px;
                    fill: none;
                }
                path {
                    stroke-width: 2px;
                    stroke: #fff;
                    stroke-linejoin: round;
                    stroke-linecap: round;
                    fill: none;
                }
            }

            &:hover {
                .link-down {
                    @include transform(scaleY(1))
                }
            }

            .link-down {
                position: fixed;
                left: 0;
                right: 0;
                top: $header-height;
                z-index: $index-header;
                width: 100vw;
                height: 150px;
                text-align: center;
                font-size: 0;
                cursor: default;
                background-color: $sms;
                @include transition(all .4s ease);
                @include transform-origin(top);
                @include transform(scaleY(0));
                @at-root {
                    .contact-theme &,
                    .material-theme & {
                        background-color: $contact;
                    }

                    .journey-theme & {
                        background-color: #0cc2a9;
                    }
                }

                a {
                    display: inline-block;
                    vertical-align: top;
                    width: 140px;
                    height: 90px;
                    padding-top: 60px;
                    line-height: 90px;
                    font-size: 14px;
                    opacity: .6;
                    color: white;
                    @include transition();
                    cursor: pointer;

                    &:hover {
                        opacity: 1;
                    }
                }

                .link-material {
                    background: url("./img/logo-material.png") no-repeat center 45px;
                    @include background-size(50px auto);
                }

                .link-contact {
                    background: url("./img/logo-contact.png") no-repeat center 45px;
                    @include background-size(50px auto);
                }

                .link-sms {
                    background: url("img/logo-sms.png") no-repeat center 45px;
                    @include background-size(50px auto);
                }
                .link-mms {
                    background: url("img/logo-mms.png") no-repeat center 45px;
                    @include background-size(50px auto);
                }
            }
        }

        .header-nav {
            display: inline-block;
            height: 100%;
            font-size: 0;
            vertical-align: top;
            white-space: nowrap;

            a {
                display: inline-block;
                width: 100px;
                padding: 0 4px;
                text-align: center;
                line-height: $header-height;
                color: $color-gray-content;
                font-size: 14px;
                background-color: $header-bg;
                border-right: 1px solid $header-bg-active;
                cursor: pointer;
                @include transition(background-color .2s ease);

                &:hover {
                    background: lighten($header-bg, 5%);
                    color: $white;
                }

                &.router-link-active {
                    color: $sms;
                    background: $header-bg-active;
                    border-left: 1px solid $header-bg-active;
                }
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
                width: 264px;
                height: 246px;
                color: white;

                &:before {
                    content: "";
                    position: absolute;
                    top: -6px;
                    right: 11px;
                    border-width: 0 6px 6px;
                    border-color: transparent transparent white;
                    border-style: solid;
                }
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

            &.border {
                margin-top: 12px;
                border-top: 1px solid $color-content;
                padding-top: 5px;
            }
            &.log-out {
                padding: 0 15px 3px;
            }
        }
    }
</style>
