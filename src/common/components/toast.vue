<template>
    <transition name="fall-and-fade">
        <div class="toast" :class="type" v-show="open">
            <button class="icon icon-close" @click="close"></button>
            <span class="icon" v-if="type" :class="'icon-' + type"></span>
            {{message}}
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                message: '',
                type: '',
                open: false,
                timer: null
            }
        },
        methods: {
            close() {
                this.open = false;
            },
            show() {
                this.open = true;
            },
            reset() {
                clearTimeout(this.timer);
                if (this.type !== 'processing')
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        this.close();
                    }, 1500);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .toast {
        position: fixed;
        z-index: $index-popup;
        top: 40%;
        left: 50%;
        height: 73px;
        line-height: 73px;
        font-size: 16px;
        padding: 0 50px;
        background-color: rgba(0, 0, 0, .8);
        color: white;
        text-align: center;
        cursor: default;
        white-space: nowrap;
        @include border-radius(3px);
        @include transform(translateX(-50%));
        @include user-select(none);

        // toast states
        span.icon {
            display: inline-block;
            width: 16px;
            margin-right: 5px;
            font-size: 14px;
            line-height: 16px;
            color: white;

            /**
             * success, correct: icon-correct
             * warn, error: icon-warn
             * processing: icon-processing spinning circle
             * info: icon-happy-face
             */
            &.icon-correct,
            &.icon-success {
                @include border-radius(100%);
                color: black;
                background-color: white;
            }

            &.icon-success:before {
                content: "\e60a";
            }

            &.icon-error:before {
                content: "\e61a";
            }

            &.icon-info:before {
                content: "\e62c";
            }
        }

        .icon-close {
            position: absolute;
            top: 9px;
            right: 10px;
            width: 12px;
            height: 12px;
            padding: 0;
            border: none;
            font-size: 12px;
            line-height: 12px;
            color: $color-gray-content;
            background-color: transparent;

            &:hover {
                color: white;
            }
        }
    }

    .fall-and-fade-enter-active, .fall-and-fade-leave-active {
        @include transition();
    }

    .fall-and-fade-enter {
        top: 20%;
        opacity: 0;
    }

    .fall-and-fade-leave-to {
        opacity: 0;
    }
</style>
