<template>
    <backdrop>
        <div class="modal" :class="size" @close="close">
            <h5 class="modal-head">
                <span :title="title">{{title}}</span>
                <button class="icon icon-close" @click="close"></button>
            </h5>
            <div class="modal-content" :style="styleArr" :class="{neat: neat !== undefined}">
                <slot></slot>
            </div>
            <div class="modal-panel">
                <slot name="buttons"></slot>
            </div>
        </div>
    </backdrop>
</template>
<script type="text/ecmascript-6">
    import Backdrop from './backdrop.vue'

    const modalStack = [];

    export default {
        props: {
            size: {
                type: String,
                'default': 'md' //  'md', 'lg'
            },
            neat: undefined,
            title: {
                type: String,
                required: true
            },
            styleArr: {
                type: Object,
                required: false
            }
        },
        mounted() {
            modalStack.push(this);
            window.addEventListener('keydown', this.escape);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.escape);
        },
        methods: {
            close() {
                this.$emit('close');
            },
            escape(e) {
                if (e.keyCode === 27) {
                    let targetModal = modalStack.pop();
                    targetModal && targetModal.close();
                }
            }
        },
        components: {
            Backdrop
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../scss/base/variables";
    @import "../../scss/base/mixin";

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: white;
        @include transform(translate(-50%, -50%));
        @include border-radius(3px);

        $modal-head-height: 45px;

        &.md {
            width: 600px;
        }

        &.lg {
            width: 1000px;
        }

        .modal-head {
            padding-left: 20px;
            padding-right: $modal-head-height;
            line-height: $modal-head-height;
            border-bottom: 1px solid #e1e1e1;
            text-align: left;
            @include ellipsis();

            .icon-close {
                position: absolute;
                top: 18px;
                right: 20px;
                width: 12px;
                height: 12px;
                padding: 0;
                border: none;
                font-size: 12px;
                line-height: 12px;
                color: $color-gray-content;
                background-color: transparent;
                cursor: pointer;

                &:hover {
                    color: $color-light-content;
                }
            }
        }

        .modal-content {
            &:not(.neat) {
                padding: 35px 20px;
            }
            &.neat {
                margin-bottom: 20px;
                overflow: auto;
                max-height: -webkit-calc(100vh - 200px);
                max-height: calc(100vh - 200px);
            }
        }

        .modal-panel {
            padding: 0 20px 20px;
            text-align: right;
            line-height: 0;

            & > .modal_text {
                margin-top: 10px;

                strong{
                    @at-root {
                        .sms-theme &,
                        .mms-theme &{
                            color: $sms;
                        }
                    }
                }
            }
        }

    }

</style>
