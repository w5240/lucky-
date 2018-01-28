<template>
    <label class="icon checkbox" @click.stop="toggle"
           :class="[{disabled}, checked ? 'icon-checkbox-check' : 'icon-checkbox']"></label>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            value: {
                type: [Array, Boolean]
            },
            source: {
                'default': false
            },
            disabled: {
                type: Boolean,
                'default': false
            },
            radio:{
                type: Boolean,
                'default': false
            }
        },
        computed: {
            checked() {
                if (this.value instanceof Array) return this.value.includes(this.source);
                return this.value;
            }
        },
        methods: {
            toggle() {
                if (this.disabled) return;
                if (this.value instanceof Array) {
                    let index = this.value.indexOf(this.source),
                        valueCopy = this.value.slice();
                    if (this.radio){
                        index === -1 ? valueCopy.splice(0,1,this.source) : valueCopy.splice(index, 1);
                    }else {
                        index === -1 ? valueCopy.push(this.source) : valueCopy.splice(index, 1);
                    }

                    this.$emit('input', valueCopy);
                } else {
                    this.$emit('input', !this.value);
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .checkbox {
        display: inline-block;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        vertical-align: inherit;
        color: $gray;
        @include user-select(none);

        @at-root {
            .contact-theme &:hover,
            .contact-theme &.icon-checkbox-check,
            .material-theme &:hover,
            .material-theme &.icon-checkbox-check {
                color: $contact;
            }

            .journey-theme &:hover,
            .journey-theme &.icon-checkbox-check {
                color: #0cc2a9;
            }
            .sms-theme &:hover,
            .sms-theme &.icon-checkbox-check,
            .mms-theme &:hover,
            .mms-theme &.icon-checkbox-check{
                color: $sms;
            }
        }

        &:not(.disabled) {
            cursor: pointer;
        }

        &.disabled {
            cursor: not-allowed;
        }
    }

</style>
