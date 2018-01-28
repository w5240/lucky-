<template>
    <transition name="backdrop-fade">
        <div class="backdrop" @scroll.stop.self.prevent>
            <slot></slot>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6"></script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../scss/base/variables";
    @import "../../scss/base/mixin";

    .backdrop {
        position: absolute;
        overflow: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: $index-mask;
        background-color: rgba(black, .56);
    }

    .backdrop-fade-enter-active, .backdrop-fade-leave-active {
        @include transition(opacity .3s ease)
    }

    .backdrop-fade-enter, .backdrop-fade-leave-to /* .fade-leave-active in <2.1.8 */
    {
        opacity: 0
    }

</style>