<template>
    <loading v-if="loading"/>
    <iframe class="email-preview-frame" v-else-if="material.type == 1 && material !== null" @load="insert"
            ref="emailPreviewFrame"></iframe>
    <div v-else-if="material.type == 0 && material !== null" class="sms-preview-frame">
        <div class="sms-preview-frame-content">
            <!-- comments necessary cuz white spaces are visible -->
            <div class="sms-preview-bubble" v-if="material.isMarketing"><!--
            -->{{signature ? '【' + signature + '】' : ''}}<!--
            -->{{/退订回TD$/.test(material.materialContent) ? material.materialContent : material.materialContent + '退订TD'}}<!--
            --><i class="bubble-tail"></i><!--
            --></div>
            <div class="sms-preview-bubble" v-else><!--
            -->{{signature ? '【' + signature + '】' : ''}}<!--
            -->{{material.materialContent}}<!--
            --><i class="bubble-tail"></i><!--
            --></div>
        </div>
    </div>
    <div v-else-if="material.type == 2 && material !== null" class="mms-modal-preview-frame">
        <div class="mms-modal-preview">
            <div v-for="(mms,index) in material.otherCount.mmsContent" :class="mms.mmsContent.trim() === '' && 'noContent'">
                <img v-if="mms.pictureUrl !== ''" :src="mms.pictureUrl">
                <p v-if="mms.mmsContent.trim() !== '' && material.isMarketing"
                   v-text="index === material.otherCount.mmsContent.length-1 ? (/退订TD$/.test(mms.mmsContent) ? mms.mmsContent:mms.mmsContent+'退订TD'):mms.mmsContent"></p>
                <p v-else-if="mms.mmsContent.trim() !== ''" v-text="mms.mmsContent"></p>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            material: {
                type: Object,
                required: true
            },
            signature: {
                type: String,
                'default': ''
            },
            loading: false
        },
        watch: {
            'material.materialContent'(content) {
                if (this.material.type == 1 && content && this.$refs.emailPreviewFrame)
                    this.insert();
            }
        },
        methods: {
            makeLinksTargetOuter(htmlStr) {
                let resultStr = htmlStr.replace(/target=["'][a-z_]*["']/ig, '');
                resultStr = resultStr.replace(/(<a[^>]*)(>)/ig, '$1 target="_blank">');
                return resultStr;
            },
            insert() {
                this.$refs.emailPreviewFrame.contentDocument.body.innerHTML = this.makeLinksTargetOuter(this.material.materialContent);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";

    .email-preview-frame {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        border: none;
    }

    .sms-preview-frame {
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        width: 270px;
        height: 450px;
        text-align: left;
        background: url("images/sms-preview-frame.png") no-repeat center;
        @include background-size(contain);

        .sms-preview-frame-content {
            position: absolute;
            overflow: auto;
            left: 55px;
            right: -17px;
            top: 130px;
            bottom: 80px;
        }
    }

    .sms-preview-bubble {
        position: relative;
        @include box-sizing();
        width: 155px;
        min-height: 6em;
        padding: 1em;
        @include border-radius(15px);
        background-color: #e5e3e3;
        word-break: break-all;
        white-space: pre-wrap;
        line-height: normal;

        .bubble-tail {
            position: absolute;
            bottom: -5px;
            left: -8px;
            display: block;
            width: 23px;
            height: 15px;
            overflow: hidden;

            &:before {
                content: '';
                position: absolute;
                bottom: 0;
                left: -30px;
                display: block;
                width: 60px;
                height: 60px;
                background: #e5e3e3;
                border-radius: 50%;
            }

            &:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: -10px;
                display: block;
                width: 20px;
                height: 20px;
                background: #fff;
                border-radius: 50%;
            }
        }
    }

    .mms-modal-preview-frame {
        position: relative;
        top: -60px;
        margin: 0 auto;
        width: 400px;
        height: 770px;
        text-align: left;
        background: url("./images/phone-mms.png") no-repeat center center;;

        .mms-modal-preview {
            position: absolute;
            width: 62%;
            height: 350px;
            top: 245px;
            left: 75px;
            overflow-y: auto;
            overflow-x: hidden;

            div {
                position: relative;
                left: 2px;
                max-width: 100%;
                margin: 0 0 10px 0;

                &:not(.noContent):after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: url(./images/phone-text-mms.png) no-repeat;
                    width: 13px;
                    height: 15px;
                }

                img {
                    width: 95%;
                    height: auto;
                    margin: 0 2% 10px 3%;
                    display: block;
                }
                p {
                    position: relative;
                    padding: 10px 20px;
                    margin: 5px;
                    line-height: 22px;
                    border-radius: 17px;
                    font-size: 12px;
                    background-color: #e5e3e3;
                    word-break: break-all;
                    max-width: 98%;
                }
            }
        }
    }


</style>
