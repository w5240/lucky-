<template>
    <div class="lucky">
        <div class="header">
            <div class="playWay"><button>玩法</button></div>
            <div class="fontRun">
                <p>132****3699盈利 570 元　　企鹅分分彩红包优惠活动公告：1、注册送100。2、首次充值100赠送100。3、每日签到送5元。祝各位贵宾好运！
                </p>
            </div>
            <div class="zouShi">
                <button>走势图</button>
            </div>
        </div>
        <div class="game">
            <ul>
                <li class="dadan"></li>
                <li class="baozi"></li>
                <li class="xiaodan"></li>
                <li class="da"></li>
                <li class="center">

                </li>
                <li class="xiao"></li>
                <li class="shuang"></li>
                <li class="dan"></li>
                <li class="dashuang"></li>
                <li class="shunzi"></li>
                <li class="xiaoshuang"></li>
            </ul>
        </div>
        <div class="money">
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        <div class="infor">
            <ul>
                <li><span >余额：48.00</span></li>
                <li>
                    <button>充值</button>
                    <button>退出</button>
                </li>
                <li>
                    <span>已下注：0，</span>
                    <span>手续费0元</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="text/babel">

    export default{
        data(){
            return {

            }
        },
        mounted(){

        },
        methods:{

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import '../common/scss/base/variables';
    @import '../common/scss/base/mixin';

    html, body{
        height: 100%;
        width:100%;
    }
    .lucky{
        width: 100%;
        height:100%;
        background-color: #082163;

        .header{
            height: 40px;
            width:100%;
            background-color: #223c7f;
            div{
                float: left;
            }
            .playWay{
                width:20%;
                text-align: center;
                button{
                    margin-top:5px;
                    background-color: #082163;
                    border:0;
                    outline: none;
                    height:30px;
                    width:80%;
                    line-height:30px;
                    color:white;
                    text-align:center;
                }

            }
            .fontRun{
                @include box-sizing();
                width:60%;
                padding: 10px 0;
                overflow: hidden;
                p{
                    float: left;
                    color:white;
                    font-size:16px;
                    font-weight:bold;
                    white-space: nowrap;
                    animation:moveRight 25s linear infinite;
                }
                @keyframes moveRight{
                    0%{
                        @include transform(translateX(0px));
                    }
                    100%{
                        @include transform(translateX(-100%));
                    }
                }
            }
            .zouShi{
                width:20%;
                text-align: center;
                button{
                    margin-top:5px;
                    background-color: #082163;
                    height:30px;
                    border:0;
                    outline: none;
                    width:80%;
                    line-height:30px;
                    color:white;
                    text-align:center;
                }
            }
        }
        .game{
            width:90%;
            height:380px;
            margin:20px auto 0;
            ul{
                width: 100%;
                height:100%;
                position: relative;
                li{
                    @include box-sizing();
                    position: absolute;
                    height:23.5%;
                    width:30%;
                    background-size:100% 100%;
                }
                .dadan{
                    top:0;
                    left:0;
                    background-image: url(./img/n-dadang.png);
                }
                .baozi{
                    top:0;
                    left:31%;
                    width:38%;
                    background-image: url(./img/n-baozi.png);
                }
                .xiaodan{
                    top:0;
                    left:70%;
                    background-image: url(./img/n-xiaodang.png);

                }
                .da{
                    top:24.5%;
                    left:0;
                    background-image: url(./img/n-da.png);
                }
                .center{
                    top:24.5%;
                    left:31%;
                    width:38%;
                    height:49%;
                }
                .xiao{
                    top:24.5%;
                    left:70%;
                    background-image: url(./img/n-xiao.png);
                }
                .shuang{
                    top:49%;
                    left:0;
                    background-image: url(./img/n-shuang.png);
                }
                .dan{
                    top:49%;
                    left:70%;
                    background-image: url(./img/n-dang.png);
                }
                .dashuang{
                    top:73.5%;
                    left:0;
                    background-image: url(./img/n-dashuang.png);
                }
                .shunzi{
                    width:38%;
                    top:73.5%;
                    left:31%;
                    background-image: url(./img/n-shunzi.png);
                }
                .xiaoshuang{
                    top:73.5%;
                    left:70%;
                    background-image: url(./img/n-xiaoshuang.png);
                }

            }
        }
    }

</style>