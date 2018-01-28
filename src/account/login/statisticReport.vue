<template>
    <div class="report">
        <h2>账号统计报告</h2>
        <ul class="condition">
            <li><span>时间查找类型：</span>
                <radio :value="dateType" :source="1" v-model="dateType">按日查询</radio>
                <radio :value="dateType" :source="2" v-model="dateType">按周查询</radio>
                <radio :value="dateType" :source="3" v-model="dateType">按月查询</radio>
                <calendar></calendar>
                <calendar></calendar>
            </li>
            <li>
                <span><checkbox :value="sh" :source="1" v-model="sh"></checkbox>SH1</span>
                <span><checkbox :value="sh" :source="2" v-model="sh"></checkbox>SH2</span>
                <span><checkbox :value="sh" :source="3" v-model="sh"></checkbox>SH3</span>
                <span><checkbox :value="sh" :source="4" v-model="sh"></checkbox>SH4</span>
                <span><checkbox :value="sh" :source="5" v-model="sh"></checkbox>SH5</span>
            </li>
            <li>
                <checkbox :value="api" v-model="api"></checkbox>是否显示API
            </li>
            <li>
                <button>查询</button>
            </li>
        </ul>
        <div class="list">
            <ul>
                <li :style="{width}">
                    <ul class="base">
                        <li>账号</li>
                        <li>license</li>
                        <li>汇总</li>
                        <li>时间</li>
                        <li v-for="i in 10">{{i}}</li>
                    </ul>
                </li>
                <li v-for="(e,index) in 3" :style="{width}">
                    <ul class="base"  :style="{borderBottom:showId[index]?'1px solid #e0e0e0':''}">
                        <li @click="$set(showId,index,!showId[index])">{{2292}}</li>
                        <li>{{222}}</li>
                        <li>{{222}}</li>
                        <li>{{222}}</li>
                        <li v-for="i in 10">{{i}}</li>
                    </ul>
                    <div class="detail" v-if="showId[index]">
                        <ul class="content">
                            <li>签名</li>
                            <li>汇总</li>
                            <li>时间</li>
                            <li v-for="i in 10">{{i}}</li>
                        </ul>
                        <ul class="content">
                            <li v-for="i in 13">{{i}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <loading v-if="loading" :style="{position:'absolute',top:'45%',left:'50%'}"></loading>
    </div>
</template>
<script type="text/babel">
    export default{
        data(){
            return {
                dateType:1,
                sh:[],
                api:false,
                showId:[],
                width:'1200px',
                loading:false,
            }
        },
        mounted(){
            this.width =2+ 80*3 +110 + 80*10 +'px';
        },
        methods:{

        },

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

    html,body,body>div:nth-child(2){
        height:100%;
        width:100%;
    }
    .report{
        height:100%;
        h2{
            margin-bottom:15px;
        }
        .condition{
            &>li:first-child{
                margin-bottom:15px;
                span{
                    font-size:14px;
                }
                label{
                    margin-right:20px;
                    &:first-child{
                        margin-left:10px;
                    }
                    &:last-child{
                        margin-right:35px;
                    }
                }
            }
            &>li:nth-child(2){
                margin-bottom:15px;
                span{
                    margin-right:20px;
                    label{
                        margin-right:10px;
                        &:hover,&.icon-checkbox-check{
                            color:#0cc2a9;
                        }
                    }
                }
            }
            &>li:nth-child(3){
                margin-bottom:15px;
                    label{
                        margin-right:10px;
                        &:hover,&.icon-checkbox-check{
                            color:#0cc2a9;
                        }
                    }
            }
            &>li:nth-child(4){
                button{
                    cursor:pointer;
                    border:0;
                    outline: none;
                    display: block;
                    background-color: #0cc2a9;
                    color:white;
                    width:100px;
                    height:30px;
                    border-radius:5px;
                    @include transition(all .4s);
                    &:hover{
                        background-color: #09a691;
                    }
                }
            }
        }
        .list{
            max-height:50%;
            max-width:90%;
            margin:25px auto 0;
            @include transform(translateX(-20px));
            overflow: auto;
            &>ul>li{
                @include box-sizing();
                display: block;
                @include clearfix();
                border:1px solid #e0e0e0;
                border-bottom:0;
                &:first-child{
                    background-color: #ececec;
                }
                &:last-child{
                    border-bottom:1px solid #e0e0e0;
                }
                .base{
                    @include clearfix();
                }
                .base li{
                    @include box-sizing();
                    float: left;
                    width:80px;
                    height:50px;
                    text-align: center;
                    line-height:50px;
                    border-width:0 1px 0 0;
                    border-color:#e0e0e0;
                    border-style: solid;
                    &:nth-child(4){
                        width:110px;
                    }
                    &:last-child{
                        border-right:1px solid #e0e0e0;
                    }
                }
                .detail{
                    margin-top:20px;
                    margin-bottom:20px;
                    margin-left:80px;
                    border-top:1px solid #e0e0e0;
                    border-bottom:1px solid #e0e0e0;
                    @include clearfix();
                    .content {
                        @include clearfix();
                        &:not(last-child){border-bottom:1px solid #e0e0e0;}
                        &:first-child{
                            background-color: #ececec;
                        }
                        li {
                            @include box-sizing();
                            float: left;
                            width: 80px;
                            height: 50px;
                            text-align: center;
                            line-height: 50px;
                            border-width: 0 1px 0 0;
                            border-color: #e0e0e0;
                            border-style: solid;
                            &:nth-child(1) {
                                border-left: 1px solid #e0e0e0;
                            }
                            &:nth-child(3) {
                                width: 110px;
                            }
                            &:last-child {
                                border-right: 1px solid #e0e0e0;
                            }
                        }
                    }
                }
            }
        }
    }
</style>