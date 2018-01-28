<template>
    <div class="crumb-nav">
        <template v-for="(route, idx) in routes">
            {{(idx > 0 && route.text) ? '> ' : ''}}
            <a @click="nav_emit(route)">{{route.text}}</a>
        </template>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            crumbs: {
                type: Array
            }
        },
        computed: {
            routes() {
                if (this.crumbs && this.crumbs.length) return this.crumbs;

                return this.$route.matched.map(route => {
                    route.text = route.meta ? route.meta.name : '';
                    return route;
                });
            }
        },
        mounted() {
            document.title = this.$route.matched[0].meta.name;
        },
        methods: {
            nav_emit(route){
                let nowPath = this.$route.path;
                if (route.redirect === nowPath || route.path === nowPath) this.$emit('refresh', route);
                else this.$router.push(route)
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .crumb-nav {
        color: $color-gray-content;
        padding: 10px 0 0 0;

        a {
            color: $color-gray-content;
            @include transition();

            &:hover {
                color: $color-content;
                text-decoration: underline;
            }
        }
    }

</style>
