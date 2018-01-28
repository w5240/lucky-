<template>
    <modal v-if="visible" size="lg" neat :title="title" @close="close">
        <preview :material="material" :signature="signature"></preview>
    </modal>
</template>
<script type="text/ecmascript-6">

    import Preview from './preview.vue'

    export default {
        data() {
            return {
                material: {},
                signature: '',
                visible: false
            }
        },
        computed: {
            title() {
                return this.material.materialName
                    ? '素材预览 - ' + this.material.materialName
                    : '素材预览';
            }
        },
        methods: {
            close() {
                this.visible = false;
                this.$set(this.$data, 'material', {});
            }
        },
        components: {
            Preview
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
    .email-preview-frame {
        height: 500px;
    }
</style>
