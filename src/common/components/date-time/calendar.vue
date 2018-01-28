<template>
    <div :class="['calendar_sms']">
        <input type="text" ref="target" :value="value" :placeholder="title" readonly>
        <span class="red-text"></span>
    </div>
</template>
<script type="text/babel">

    import init_datetimepicker from './bootstrap-datetimepicker'
    import autoScroll from './autoScroll'
    import $ from 'jquery';
    import {getDateStr} from '../../utils/dateUtils'

    function getStamp(dateStr) {
        let [year, month, day] = dateStr.split('-');
        return (new Date(year, month, day)).getTime()
    }

    let $dateTimePicker = null;

    export default{
        props: {
            value: '',
            start: '',
            end: '',
            type: {
                type: String,
                default: 'yyyy-mm-dd',
            },
            title:{
                type: String,
                default: ''
            }
        },
        data(){
            return {
                attribute: {},
            }
        },
        watch: {
            start(newStart) {
                if ($dateTimePicker) {
                    $dateTimePicker.datetimepicker('setStartDate', newStart);
                    if (this.value && newStart && (getStamp(this.value) < getStamp(newStart))) {
                        this.$emit('input', this.start);
                        $dateTimePicker.datetimepicker('update');
                    }
                }
            }
        },
        mounted() {
            switch (this.type) {
                case 'yyyy-mm-dd':
                    this.attribute = {
                        startDate: new Date(),
                        initialDate: new Date(),
                        endDate: this.end,
                        startView: 'year',           //开始点
                        autoclose: true,        //自动关闭
                        format: 'yyyy-mm-dd',   //时间格式
                        todayBtn: true,         //是否显示今日的按钮
                        todayHighlight: true,    //是否突出当天日期
//                        viewSelect: 'decade',    //更新点 可为年 月 日
                        minView: 2,              //设置结束点  如 年-月-日->off
                    };
                    break;
                case 'hh:ii':
                    this.attribute = {
                        startDate: this.start,
                        initialDate: new Date(),
                        endDate: this.end,
                        startView: 'day',     //开始点
                        autoclose: true,        //自动关闭
                        format: 'hh:ii',        //时间格式
                        todayBtn: false,          //是否显示今日的按钮
                        todayHighlight: true,    //是否突出当天日期
                        viewSelect: 'decade',      //更新点 可为年 月 日
                        showMeridian: false,    //子视图
                        minuteStep: 1,          //间隔minuteStep创建一个预设
                        MaxView: 'month',       //设置开始点 如 on->日-时-分-秒
                    };
                    break;
                case 'before':
                    this.attribute = {
                        initialDate: new Date(),
                        endDate: new Date(),
                        startView: 'year',           //开始点
                        autoclose: true,        //自动关闭
                        format: 'yyyy-mm-dd',   //时间格式
                        todayBtn: true,         //是否显示今日的按钮
                        todayHighlight: true,    //是否突出当天日期
//                        viewSelect: 'decade',    //更新点 可为年 月 日
                        minView: 2,              //设置结束点  如 年-月-日->off
                    };
                    break;
                case 'match':
                    this.attribute = {
                        startDate: this.start,
//                        initialDate: new Date(),
                        endDate: this.end,
                        startView: 'year',           //开始点
                        autoclose: true,        //自动关闭
                        format: 'yyyy-mm-dd',   //时间格式
                        todayBtn: true,         //是否显示今日的按钮
                        todayHighlight: true,    //是否突出当天日期
//                        viewSelect: 'decade',    //更新点 可为年 月 日
                        minView: 2,              //设置结束点  如 年-月-日->off
                    };
                    break;
            }


            const vm = this;

            init_datetimepicker($);
            $dateTimePicker = $(this.$refs.target)
                .datetimepicker(this.attribute)
                .on('changeDate', function () {
                    vm.$emit('input', this.value);
                });
            autoScroll.watch($dateTimePicker);
        },
//        beforeDestroy() {
//            autoScroll.stop(this.$dateTimePicker);
//        }
    }
</script>
<style lang="less" type="text/less" rel="stylesheet/less">

    @import "build_standalone.less";

    .calendar_sms {
        display: inline-block;
        width: 169px;
        padding: 0 25px;

        &.error {
            [type="text"] {
                border-color: #cc3333;
                background-color: #ffcccc;
            }
        }

        [type="text"] {
            height: 35px;
            width: 100%;
            padding: 0 10px;
            line-height: 33px;
            border: 1px solid #e0e0e0;
            border-radius: 2px;
            box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.07);
            transition: .3s all;

            &:hover {
                border-color: #999;
            }

            &:focus {
                border-color: #999;
            }
        }
    }

</style>
