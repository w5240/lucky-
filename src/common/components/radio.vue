<template>
    <label class="icon radio" @click.stop="toggle"
           :class="[{disabled}, checked ? 'icon-radio-check' : 'icon-radio']">
        <div class="slot"><slot></slot></div>
    </label>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            value: {
                require:true,
                type: [Number,String]
            },
            source: {
                type: Number
            },
            disabled: {
                type: Boolean,
                'default': false
            },
        },
        computed: {
            checked(){
                return this.value === this.source;
            }
        },
        methods: {
            toggle() {
                if (this.disabled) return;
                this.$emit('input', this.source);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .radio {
        display: inline-block;
        font-size: 18px;
        height: 20px;
        position: relative;
        line-height: 20px;
        vertical-align: inherit;
        color: #e5e5e5;
        @include user-select(none);
        &.icon-radio-check{
            color:#0cc2a9
        }
        &.icon-radio{
            &:hover{
                color:#0cc2a9;
            }
        }
        .slot{
            /*padding-right:26px;*/
            padding-left:26px;
            color:#666;
            font-size: 16px;
        }
        @at-root {
            .umone-theme &:hover {
                color: #0cc2a9;
            }
            .umone-theme &.icon-radio-check{
                color: #0cc2a9;
            }
        }

        &:not(.disabled) {
            cursor: pointer;
        }

        &.disabled {
            cursor: not-allowed;
        }
        &:before{
            position: absolute;
            /*left:20px;*/
            left:0;
            top:0;
        }
    }

</style>
