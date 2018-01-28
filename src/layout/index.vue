<template>
    <div :class="$route.matched[0].name + '-theme'">
        <nav-header></nav-header>
        <div class="content-wrapper">
            <router-view></router-view>
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

    export default {
        components: {
            NavHeader
        },
        methods: {
            goLogin() {
                this.$store.dispatch(SIGN_OUT);
                this.$router.push({name: 'login'});
            },
            whatever() {
                this.$store.dispatch(SET_AUTH_LOCK)
            }
        },
    }

</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../common/scss/base/variables';
    @import '../common/scss/base/mixin';

    .content-wrapper {
        @include box-sizing();
        height: 100vh;
        min-width: 800px;
        padding-top: $header-height;
        background-color: $content-bg;
    }

</style>
