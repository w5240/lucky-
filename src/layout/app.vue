<template>
    <div class='journey-theme'>
        <nav-header></nav-header>
        <div class="content-wrapper">
            <sidebar></sidebar>
            <div class="content-r-wrapper">
                <router-view></router-view>
            </div>
        </div>
        <modal v-if="$store.state.authLock.message + $store.state.authLock.title" :title="$store.state.authLock.title">
            <div v-if="$store.state.authLock.message" v-text="$store.state.authLock.message"></div>
            <input type="button" slot="buttons" class="btn btn-md btn-journey" value="前往登录"
                   @click="goLogin">
            <input v-if="$store.state.user.authorization" type="button" slot="buttons" class="btn btn-md btn-white"
                   value="知道了" @click="whatever">
        </modal>
    </div>
</template>
<script type="text/babel">
    import NavHeader from './header/header.vue'
    import {SIGN_OUT, SET_AUTH_LOCK} from '../common/vuex/actionTypes'
    import sidebar from './sidbar.vue'

    export default{
        methods: {
            goLogin() {
                this.$store.dispatch(SIGN_OUT);
                this.$router.push({name: 'login'});
            },
            whatever() {
                this.$store.dispatch(SET_AUTH_LOCK)
            }
        },
        components: {
            NavHeader,
            sidebar
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import '../common/scss/base/variables';
    @import '../common/scss/base/mixin';

    .content-wrapper {
        position: relative;
        height: -webkit-calc(100vh - 63px);
        height: calc(100vh - 63px);
        background-color: $content-bg;
        box-sizing: border-box;
        @include clearfix();

        .content-r-wrapper {
            position: absolute;
            @include box-sizing();
            right: 0;
            top: 60px;
            bottom: 0;
            left: $sidebar-width;
            height: 100%;
            padding: 15px;
            background-color: $content-bg;
            width: calc(100% - #{$sidebar-width});
            overflow: auto;
        }

    }

</style>