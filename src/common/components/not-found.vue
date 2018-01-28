<template>
    <div>
        <h1> 404 </h1>
    </div>
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
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer);
                    this.close();
                }, 4000);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .toast {
        position: fixed;
        z-index: 22;
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

        &.correct {

        }

        &.warn {
        }

        &.error {
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

        span.icon {
            font-size: 20px;
            line-height: normal;
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
