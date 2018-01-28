<template>
    <div class="side-menu">
        <div v-if="$store.state.user.isAdmin == 0" v-for="menu in proList" :key="menu.title.text">
            <div :class="['menu-title', menu.title.className, {'active': currentModule === menu.name}]">
                {{menu.title.text}}
            </div>
            <ul>
                <li class="menu-subtitle" v-if="menu.subtitle" v-text="menu.subtitle.text"></li>
                <router-link class="menu-child" tag="li" v-for="child in menu.childTitle" :to="child.link"
                             v-text="child.text" :key="child.text"></router-link>
            </ul>
        </div>
    </div>
</template>
<script type="text/babel">
    export default{
        data(){
            return {
                proList: []
            }
        },
        computed: {
            currentModule(){
                return this.$route.meta.name;
            }
        },
        mounted(){
            let user = this.$store.state.user;
            if (user.isTemplateShop == 1) {
                this.proList.push(
                    {
                        name: 'module',
                        title: {text: '模块', className: 'menu-module'},
                        subtitle: {text: 'Message'},
                        childTitle: [
                            {text: '发送记录', link: {name: 'proRecord'}},
                        ]
                    }
                );
            }
            if (user.isAppreciationTemplate == 1) {
                this.proList.push({
                    name: 'manage',
                    title: {text: '管理', className: 'menu-manage'},
                    subtitle: false,
                    childTitle: [
                        {text: '发送提醒设置', link: {name: 'proRemind'}},
                        {text: '子账号管理', link: {name: 'proSubUser'}}
                    ]
                })
            } else {
                this.proList.push({
                    name: 'manage',
                    title: {text: '管理', className: 'menu-manage'},
                    subtitle: false,
                    childTitle: [
                        {text: '发送提醒设置', link: {name: 'proRemind'}},
                    ]
                })
            }
            if (this.$route.name === 'proRecord' && user.isTemplateShop != 1){
                this.$router.push(this.proList[0].childTitle[0].link)
            }
            if (this.$route.name === 'proSubUser' && user.isAppreciationTemplate != 1){
                this.$router.push(this.proList[0].childTitle[0].link)
            }

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../common/scss/base/variables';
    @import '../common/scss/base/mixin';

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

</style>
