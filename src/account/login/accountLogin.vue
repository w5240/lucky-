<template>
    <div>
        <div class="accountLogin-header">
            子账号登陆
        </div>
        <div class="listContainer">
            <table class="table" border="1" cellspacing="0">
                <tr>
                    <td>账号</td>
                    <td>licence</td>
                    <td>操作</td>
                </tr>
                <tr v-for="account in accounts">
                    <td>{{account.name}}</td>
                    <td>licence</td>
                    <td >
                       <span class="account-login" @click="doLogin(account)">登陆</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script type="text/babel">
    import {RECOVER_USER_INFO, SIGN_IN} from '../../common/vuex/actionTypes'
    import accountModel from '../../common/model/accountModel'
    import userModel from './../userModel'

    export default {
        data: function() {
            return {
                user: {
                    email: '',
                    id: '',
                    userName: ''
                },
                accounts: []
            }
        },
        methods: {
            'getUserAccounts': function() {
                this.accounts = [];
            },
            'doLogin': function(user) {

                accountModel
                    .cheatLogin(user.name)
                    .then(({body: {data: user}}) => {
                        this.$store.dispatch(SIGN_IN, user);

                        if (user.loginCount === 1) {
                            userModel
                                .getUserTest(this.user.id)
                                .then(({body: {data: {test}}}) => {
                                    this.checkResult.dmdActivityName = test.dmdActivityName;
                                    this.checkResult.sftpHost = test.sftpHost;
                                    this.checkResult.sftpUserName = test.sftpUserName;
                                    this.validate();
                                })
                        } else {
                            this.$router.push({name: 'home'});
                        }
                    })
                    .catch(e => {
                    });
            }
        },
        mounted: function() {
            this.user.email = this.$route.params.email;
            this.accounts = localStorage.getItem('userOption') ? JSON.parse( localStorage.getItem('userOption') ) : [];
            console.log(this.accounts);
        }
    }
</script>
<style type="text/scss" lang="scss" rel="stylesheet/scss">
    @import '../../common/scss/base/variables.scss';
    .accountLogin-header {
        font-size: 18px;
        font-weight: bold;
    }
    .listContainer {
        padding: 60px 80px;
        font-size: 16px;
        table {
            /*border: 1px solid black;*/
            text-align: center;
            tr { }
            td {
                padding: 6px 8px;
                min-width: 200px;
            }
        }
        .account-login {
            cursor: pointer;
            color: $sms;
            box-shadow: 0 1px 0 0 $sms;
            user-select: none;
            &:hover {
                color: $sms-active;
                box-shadow: 0 1px 0 0 $sms-active;
            }
        }
    }
</style>