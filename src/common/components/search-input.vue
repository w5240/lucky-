<template>
    <div class="search-box">
        <input type="text" :maxlength="max" :minlength="min" @keydown.enter="search(inner_value)"
               placeholder="按名称搜索…" v-model="inner_value">
        <span class="icon icon-search" @mousedown.prevent="search(inner_value)"></span>
    </div>
</template>
<script>

    export default{
        props: {
            max: {
                type: Number,
                default: 15
            },
            min: {
                type: Number,
                default: 0
            },
            value: ''
        },
        data(){
            return {
                focus: false,
                searchVal: ''
            }
        },
        computed: {
            inner_value: {
                get() {
                    return this.value;
                },
                set(val, old) {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            search(searchVal){
                this.focus = false;
                this.$emit('search', searchVal);
            }
        }
    }

</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .search-box {
        position: relative;
        @include clearfix();
        display: inline-block;
        float: right;

        input {
            float: right;
            position: relative;
            width: 270px;
            vertical-align: middle;
            -webkit-transition: 0.3s all cubic-bezier(0.78, 0.14, 0.15, 0.86);
            transition: 0.3s all cubic-bezier(0.78, 0.14, 0.15, 0.86);
            font-size: 14px;
            height: 35px;
            line-height: 35px;
            color: #333;
            padding: 0 2em 0 1em;
            border: 1px solid #e0e0e0;
            box-sizing: border-box;
            border-radius: 50px;
            @include ellipsis();

            &:hover {
                border-color: $color-gray-content;
            }
        }
        span {
            position: absolute;
            right: 10px;
            top: 8px;
            color: #999;
            font-size: 18px;
            cursor: pointer;
        }
    }

</style>