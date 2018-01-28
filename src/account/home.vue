<template>
    <div class="sms-home">
        <!-- 普通用户登陆后视图 -->
        <nav-header></nav-header>
        <ul class="projects">
            <li class="base contact" @click="jumpTo('contact')"></li>
            <li class="base material" @click="jumpTo('material')"></li>
            <li class="base sendSms" @click="jumpTo('sms')"></li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">

    import LINKS from '../LINKS'
    import NavHeader from '../layout/header/header.vue'

    export default {
        data() {
            return {}
        },
        mounted() {

        },
        methods: {
            jumpTo(systemName) {
                if (process.env.NODE_ENV === 'development') {
                    systemName === 'sms' ?
                        location.href = `${LINKS.SMS}/sms/?&user=${JSON.stringify(this.$store.state.user)}` :
                        location.href = `${LINKS.ORIGIN}/${systemName}/?&user=${JSON.stringify(this.$store.state.user)}`
                } else {
                    location.href = `${LINKS.ORIGIN}/${systemName}/?&user=${JSON.stringify(this.$store.state.user)}`;
                }
                // user: {authorization, email, id, isAdmin, loginCount, userName}
            }
        },
        components: {
            NavHeader
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../common/scss/base/variables";
    @import "../common/scss/base/mixin";

    $transition_time: .8s;

    // 普通用户登录后视图
    .sms-home {
        height: 100vh;
        overflow: hidden;
        min-width: 800px;
        background: url("./images/home-bg.png") no-repeat left bottom;
        @include background-size(cover);

        .projects {
            margin-top: 30vh;
            font-size: 0;
            text-align: center;
            white-space: nowrap;
        }

        .base {
            position: relative;
            display: inline-block;
            width: 216px;
            height: 214px;
            text-align: left;
            color: #faf9fc;
            font-size: 28px;
            cursor: pointer;
            @include transition();
            @include keyframes(slide-fade-down) {
                0% {
                    opacity: 0;
                    @include transform(translateY(-80px));
                }
                100% {
                    opacity: 1;
                    @include transform(translateY(0));
                }
            }

            &:hover {
                @include box-shadow(5px 5px 9px rgba(black, .5));
            }

            + .base {
                margin-left: 36px;
            }

            .base-icon {
                position: absolute;
                top: 20px;
                right: 20px;
                display: block;
            }

            .base-title {
                position: absolute;
                bottom: 20px;
                margin-left: 20px;
                span {
                    display: block;
                    width: 100%;
                }
            }

            // 联系人模块
            &.contact {
                background: url("./images/contact.png") no-repeat center;
                @include background-size(cover);
                @include animation(slide-fade-down $transition_time linear backwards);

                svg {
                    fill: white;
                }
            }
            // 素材模块
            &.material {
                background: url("./images/material.png") no-repeat center;
                @include background-size(cover);
                @include animation(slide-fade-down ($transition_time - .1s) .1s linear backwards);

                .material-icon {
                    width: 38px;
                    height: 38px;
                    background: url("./images/material-icon.png") no-repeat center;
                }
            }
            &.journey {
                width: 478px;
                background: url("./images/journey.png") no-repeat center;
                @include background-size(cover);
                @include animation(slide-fade-down ($transition_time - .2s) .2s linear backwards);

                .journey-icon {
                    width: 49px;
                    height: 49px;
                    background: url("../layout/header/img/logo-journey.png") no-repeat center top;
                }
            }
            &.sendSms {
                width: 478px;
                background: url("./images/project-sms-bg.png") no-repeat center;
                @include background-size(cover);
                @include animation(slide-fade-down ($transition_time - .2s) .2s linear backwards);
            }
        }
    }

</style>
