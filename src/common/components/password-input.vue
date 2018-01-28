<template>
    <div class="password-input">
        <input required v-model="password" v-if="!visible" type="password" class="input-field"
               :minlength="minlength" :maxlength="maxlength" data-tip="允许8-20个字符,且不可为空">
        <input required v-model="password" v-else type="text" class="input-field" :minlength="minlength"
               :maxlength="maxlength" data-tip="允许8-20个字符,且不可为空">
        <i :class="['icon', visible ? 'icon-eye' : 'icon-eye-closed']" @click="toggle"></i>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            value: {
                required: true
            },
            minlength: {
                'default': 8
            },
            maxlength: {
                'default': 20
            }
        },
        data() {
            return {
                visible: false
            }
        },
        computed: {
            password: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            toggle() {
                this.visible = !this.visible;
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .password-input{
        position: relative;
        display: inline-block;
        width: -webkit-calc(100% - 6em);
        width: calc(100% - 6em);

        .input-field{
            width: 100%;
        }

        .icon {
            position: absolute;
            right: $input-field-height / 2;
            top: 0;
            font-size: 16px;
            color: $color-light-content;
            line-height: $input-field-height;
            cursor: pointer;
            @include transition(color .2s ease);

            &:hover{
                color: $color-content;
            }
        }
    }
</style>
