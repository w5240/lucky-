<template>
    <modal :title="title" @close="cancel">
        <slot></slot>
        <input slot="buttons" type="button" class="btn btn-md btn-white" @click="cancel" value="取消"/>
        <input slot="buttons" type="button" class="btn btn-md" tabindex="1" autofocus
               :class="confirmBtnClass" @click="sure" value="确定"/>
    </modal>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            title: {
                type: String,
                'default': '确认操作'
            },
            theme: ''
        },
        computed: {
            confirmBtnClass() {
                return 'btn-' + (this.$route ? this.$route.matched[0].name : this.theme) + '-ensure';
            }
        },
        mounted() {
            window.addEventListener('keydown', this.keyDown, false);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.keyDown, false);
        },
        methods: {
            keyDown(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.sure();
                }
            },
            cancel() {
                this.$emit('cancel');
            },
            sure() {
                this.$emit('confirm');
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../scss/base/variables";
    @import "../../scss/base/mixin";

    input[type=button]:nth-of-type(2) {
        text-align: center;
        box-shadow: none;
        color: #fff;
        background: $sms;
        border: 1px solid $sms;
        line-height: 33px;
        cursor: pointer;
        &:hover {
            background-color: $sms-hover;
        }
    }
</style>
