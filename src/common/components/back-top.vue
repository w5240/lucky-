<template>
    <transition name="fade">
        <span v-show="visible" class="back-to-list-top" :class="relative === undefined ? 'fixed' : 'relative'" @click.prevent="backTop" :style="{'bottom': offsetBottom + 'px','right': offsetRight + 'px'}"></span>
    </transition>
</template>
<script type="text/ecmascript-6">

    const VELOCITY = 1 / 300;

    export default{
        props: {
            container: null,
            offsetBottom: {
                type: Number,
            },
            offsetRight: {
                type: Number,
            },
            relative: undefined,
        },
        data() {
            return {
                visible: false,

                _totalLength: 0,
                _firstFrameTime: 0,
                _now: 0,
                _remain: 0
            }
        },
        mounted() {
            // requestAnim shim layer by Paul Irish
            window.requestAnimFrame = window.requestAnimFrame
                || window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function (/* function */ callback, /* DOMElement */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };

        },
        beforeDestroy() {
            this.container.removeEventListener('scroll', this._checker);
        },
        methods: {
            _checker(e) {
                if (!this.offsetBottom){
//                    this.offsetBottom = document.body.offsetHeight - e.target.clientHeight - e.target.offsetTop + 40;
                    this.offsetBottom = 40;
//                    this.offsetRight = document.body.offsetWidth - e.target.clientWidth - e.target.offsetLeft + 40;
                    this.offsetRight = 40;
                }
                if (this.container.scrollTop > 50 !== this.visible) {this.visible = !this.visible}
            },
            // 返回顶部的效果
            _easeToTop() {
                if (!this._firstFrameTime) {
                    this._firstFrameTime = Date.now();
                }
                this._now = Date.now();
                this._remain = this._totalLength * (1 - (this._now - this._firstFrameTime) * VELOCITY);
                this._remain = this._remain <= 0 ? 0 : this._remain;
                this.container.scrollTop = this._remain;
                if (this._remain === 0) {
                    this._firstFrameTime = null;
                    return false;
                }

                window.requestAnimFrame(this._easeToTop);
            },
            // 点击按钮返回顶部
            backTop() {
                this._totalLength = this.container.scrollTop;
                this._easeToTop();
            }
        }
    }

</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .back-to-list-top {
        width: 40px;
        height: 40px;
        border: none;
        @include border-radius(100%);
        background-color: rgba($contact, .8);
        @include transition();
        cursor: pointer;
        z-index: 60000;

        &.fixed{
            position: fixed;
        }

        &.relative{
            position: absolute;
        }

        &:hover {
            background-color: $contact;
        }

        &:after {
            content: '';
            display: block;
            margin: 15px auto 0;
            border-top: 2px solid white;
            border-right: 2px solid white;
            width: 14px;
            height: 14px;
            @include transform(rotate(-45deg));
        }
    }

</style>
