<template>
    <div class="warp">
        <div class="operate">
            <label>tomcat编号:
                <selector :options='tomcatOptions' v-model='tomcatNo'></selector>
            </label>
            <label>服务器:
                <selector :options="[{name:'正式',id:'gate'},{name:'beta',id:'gate-beta'}]"
                          v-model='tomcatNo_base'></selector>
            </label>
            <button class="btn-sms" @click='changeOperate(0)'>open</button>
            <button class="btn-sms" @click='changeOperate(1)'>close</button>
        </div>
        <div class="postman">
            <label>
                <span>接口地址:</span>
                <selector :options="modelTypes" :search="true" v-model="modelId"
                          @select="allUrl = modelOptions[$event.id]"></selector>
                <selector :options="allUrl" :search="true" v-model="message.id"
                          @select="message = Object.assign({},$event)"></selector>
                <button class="btn-sms send" @click='send'>send</button>
            </label>
            <table class="center_table" v-if="message.data" style="float: right;">
                <tbody>
                <tr v-for="(field, key) in message.data" :key="key">
                    <td>
                        <label class="label"><strong>{{key}}:</strong><input type="text" style="margin: 0 1em"
                                                                             v-model="message.data[key]">
                            <span class="name"
                                  v-text="message.remind[key].indexOf('*') === -1 ? message.remind[key]:message.remind[key].substring(0,message.remind[key].indexOf('*'))"></span>
                            <i v-if="message.remind[key].indexOf('*') !== -1"
                                  v-text="message.remind[key].substring(message.remind[key].indexOf('*'))"
                                  style="color: red;font-size: 20px"></i></label>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <p v-text="content"></p>
    </div>
</template>
<script type="text/babel">
    import adminModel from '../../common/model/postman'
    import smsModel from '../../common/model/smsModel'
    import accountModel from '../../common/model/accountModel'
    import modelOptions from './modelOptions'

    export default {
        data() {
            return {
                modelOptions: modelOptions,
                testType: 'smsModel',
                tomcatNo: null,
                tomcatNo_base: 'gate-beta',
                message: {
                    id: '',
                    data: null,
                },
                allUrl: modelOptions['sms'],
                tomcatOptions: [
                    {name: 'B区-生产-3', id: 3},
                    {name: 'D区-生产-4', id: 4},
                    {name: 'B区-发送-5', id: 5},
                    {name: 'D区-生产-6', id: 6},
                    {name: 'B区-回收-7', id: 7},
                    {name: 'D区-生产-8', id: 8},
                ],
                modelTypes: [
//                    {name: 'adminModel', id: 'admin'},
                    {name: 'smsModel', id: 'sms'},
//                    {name: 'accountModel', id: 'account'},
                ],
                modelId: 'sms',
                data: [],
                content: ''
            }
        },
        computed: {},
        mounted() {

        },
        watch: {},
        methods: {
            changeOperate(type) {
                adminModel['changeOperate'](`https://${this.tomcatNo_base}.dmacloud.com/smsservice/api/smsservice/v1/tomcat/operate?username=rewritesms&password=qdum_8018&tomcatNo=${this.tomcatNo}&operate=${type}`)
                    .then(({body: {data: {result}}}) => {
                        this.$toast(result, 'correct')
                    })
            },
            send() {
                let data;
                data = Object.assign({}, this.message.data);
                for (let key in data) {
                    if (key.indexOf('(') !== -1) {
                        data[key.substring(0, key.indexOf('('))] = data[key];
                        delete data[key];
                    }
                }
                switch (this.modelId) {
                    case 'sms':
                        smsModel[this.message.id](data).then(({body: e}) => {
                            console.log(e)
                        });
                        break;
                    case 'admin':
                        adminModel[this.message.id](data).then(({body: e}) => {
                            console.log(e)
                        });
                        break;
                    case 'account':
                        accountModel[this.message.id](data).then(({body: e}) => {
                            console.log(e)
                        });
                        break;
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';
    /*@import '../../message/base';*/
    /*@import '../../message/nav';*/

    .operate {
        text-align: right;
        margin-top: 2em;
        font-size: 16px;
        float: left;

        label {
            display: inline-block;
            input {
                outline: none;
                text-indent: 1em;
                border: 1px solid $sms;
                height: 35px;
                border-radius: 5px;
            }
        }
        button {
            margin: 10px;
        }
    }

    .postman {
        float: left;
        text-align: left;
        margin-top: 2em;
        font-size: 16px;

        label {
            height: 35px;
            display: block;
            margin: 3px 0;

            span:not(.name) {
                display: inline-block;
                font-size: 16px;
                width: 5em;
                line-height: 35px;
            }
            span.name {
                display: inline-block;
                font-size: 16px;
                line-height: 35px;
                left: 1em;
            }
            strong {
                min-width: 10em;
                display: inline-block;
                text-align: right;
            }
            .send {
                width: 35px;
            }
            input {
                outline: none;
                text-indent: 1em;
                border: 1px solid $sms;
                width: 170px;
                box-sizing: border-box;
                height: 35px;
                border-radius: 5px;
            }
            .url {
                width: 470px;
            }
            .selector {
                width: 170px;
                border-radius: 5px;
                margin-left: -3px;

                &:nth-of-type(2) {
                    width: 420px;
                }
            }
        }
        button {
            margin: 0 10px;
        }
    }

</style>
