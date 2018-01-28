<template>
    <transition name="fade-in-out">
        <div class="tip" :class="[direction, message.length > 6 ? 'lg' : 'tiny']"
              v-show="open" v-html="message" @mouseenter="show" @mouseleave="leave"></div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                message: '',
                direction: 'top',
                open: false
            }
        },
        methods: {
            leave() {
                this.$nextTick(() => {
                    this.open = false;
                })
            },
            show() {
                this.open = true;
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .tip {
        position: absolute;
        z-index: $index-popup;
        color: white;
        font-size: 12px;
        @include user-select(none);
        background-color: black;
        white-space: normal;
        word-break:break-all;
        max-width: 20em;

        &.top {
            &.tiny {
                @include transform(translate(-50%, -100%));
                &:after {
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-top-color: black;
                }
            }

            &.lg {
                @include transform(translate(-24px, -100%));
                &:after {
                    top: 100%;
                    left: 24px;
                    margin-left: -5px;
                    border-top-color: black;
                }
            }
        }

        &.bottom {
            &.tiny {
                @include transform(translate(-50%, 0));

                &:after {
                    bottom: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-bottom-color: black;
                }
            }

            &.lg {
                @include transform(translate(-24px, 0));

                &:after {
                    bottom: 100%;
                    left: 24px;
                    margin-left: -5px;
                    border-bottom-color: black;
                }
            }
        }

        &.left {
            @include transform(translate(-100%, -50%));

            &:after {
                left: 100%;
                top: 50%;
                margin-top: -5px;
                border-left-color: black;
            }
        }

        &.right {
            @include transform(translate(0, -50%));

            &:after {
                right: 100%;
                top: 50%;
                margin-top: -5px;
                border-right-color: black;
            }
        }

        &.tiny {
            padding: 0 10px;
            line-height: 25px;
            @include border-radius(2px);
        }

        &.lg {
            padding: 12px 10px;
            line-height: 18px;
            @include border-radius(3px);
            opacity: .8;
        }

        &:after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 5px solid transparent;
        }
    }

    .fade-in-out-enter-active, .fade-in-out-leave-active {
        @include transition(all .3s ease);
    }

    .fade-in-out-enter {
        @include transform(scale(0));
        opacity: 0;
    }

    .fade-in-out-leave-to {
        @include transform(scale(0));
        opacity: 0;
    }

</style>
