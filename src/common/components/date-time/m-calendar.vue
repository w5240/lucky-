<template>
    <div :class="['calendarWrapper', className]">
        <label class="calendar-date">
            <input type="text" readonly :value="showTime ? chooseTime : chooseDate" :class="{active: show}" @click="showCalendar">
            <i class="calendar-icon"></i>
        </label>
        <transition name="slide">
            <div :class="['calendar', {'calendar-top': listTop}]" v-if="show">
                <div class="calendar-header">
                    <a href="javascript:void(0);" class="year-prev" @click="yearPrev"></a>
                    <a href="javascript:void(0);" class="month-prev" @click="monthPrev"></a>
                    <div class="calendar-year">
                        <input type="text" class="year-text" readonly :value="year" @click="showYear">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showYearList">
                                <li v-for="yy in yearList" :class="{active: yy == year}" v-text="yy" @click="chooseYear(yy)"></li>
                            </ul>
                        </transition>
                    </div>
                    <div class="calendar-month">
                        <input type="text" class="month-text" readonly :value="monthList[parseInt(month) - 1]" @click="showMonth">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showMonthList">
                                <li v-for="(mm, index) in monthList" :class="{active: index == parseInt(month) - 1}" v-text="mm" @click="chooseMonth(index)"></li>
                            </ul>
                        </transition>
                    </div>
                    <a href="javascript:void(0);" class="month-next" @click="monthNext"></a>
                    <a href="javascript:void(0);" class="year-next" @click="yearNext"></a>
                </div>
                <div class="calendar-body">
                    <table>
                        <thead>
                        <tr>
                            <th v-for="day in week" v-text="day"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td v-for="td in firstTr">
                                <input type="text" readonly :value="td" :disabled="td > 7 || lessStart(td) || greaterEnd(td)" :class="{active: (td <= 7 && chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td) || (td > 7 && chooseDateArr[0] == year && chooseDateArr[1] == month - 1 && chooseDateArr[2] == td)}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        <tr v-for="tr in trs">
                            <td v-for="td in tr">
                                <input type="text" readonly :value="td" :disabled="lessStart(td) || greaterEnd(td)" :class="{active: chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        <tr>
                            <td v-for="td in lastTr">
                                <input type="text" readonly :value="td" :disabled="td < 21 || lessStart(td) || greaterEnd(td)" :class="{active: (td >= 21 && chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td) || (td < 21 && chooseDateArr[0] == year && chooseDateArr[1] == month + 1 && chooseDateArr[2] == td)}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mask-list-down" v-show="showMonthList || showYearList || showHourList || showMinuteList || showSecondList" @click="hideListDown"></div>
                </div>
                <div class="calendar-footer" v-if="!showTime">
                    <input type="button" value="确定" @mousedown="hideCalendar">
                    <input type="button" value="今天" @mousedown="chooseToday">
                    <input type="button" value="清空" @mousedown="clear">
                </div>
                <div class="calendar-footer time" v-if="!!showTime">
                    <div class="calendar-time">
                        <input type="text" readonly :value="hour" @click="showHour">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showHourList">
                                <li v-for="hh in hourList" :class="{active: hh == hour}" v-text="hh" @click="chooseHour(hh)"></li>
                            </ul>
                        </transition>
                    </div>
                    <span>:</span>
                    <div class="calendar-time">
                        <input type="text" readonly :value="minute" @click="showMinute">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showMinuteList">
                                <li v-for="mm in minuteList" :class="{active: mm == minute}" v-text="mm" @click="chooseMinute(mm)"></li>
                            </ul>
                        </transition>
                    </div>
                    <span>:</span>
                    <div class="calendar-time">
                        <input type="text" readonly :value="second" @click="showSecond">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showSecondList">
                                <li v-for="ss in minuteList" :class="{active: ss == second}" v-text="ss" @click="chooseSecond(ss)"></li>
                            </ul>
                        </transition>
                    </div>
                    <input type="button" value="清空" @mousedown="clear">
                    <input type="button" value="确定" @mousedown="ensure">
                </div>
            </div>
        </transition>
        <div class="mask-opacity" v-show="show" @click="hideCalendar"></div>
    </div>
</template>

<script type="text/babel">
    
    //将日月小于10的前边补0
    function format(i) {
        return i < 10 ? '0' + i : i;
    }
    
    export default{
        props: {
            // 默认日期
            date: String,
            // 是否显示时间选择
            showTime: {
                default: false
            },
            // 开始日期
            start: String,
            // 结束日期
            end: String,
            // class名,用于修改样式
            className: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                //日期分隔符
                separator: '-',
                year: '',
                month: '',
                hour: '00',
                minute: '00',
                second: '00',
                chooseDate: '',
                chooseTime: '',
                week: ['日', '一', '二', '三', '四', '五', '六'],
                monthList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                listTop: false,
                show: false,
                showMonthList: false,
                showYearList: false,
                showHourList: false,
                showMinuteList: false,
                showSecondList: false,
                startYear: 1970,
                endYear: 2116
            }
        },
        computed: {
            // 选择的日期拆成数组,判断当前日期使用
            chooseDateArr(){
                return this.chooseDate.split(this.separator);
            },
            // 当前月第一天是星期几
            startDay() {
                return new Date(this.year, this.month - 1, 1).getDay()
            },
            // 当前月的下个月的第一天是星期几
            nextStartDay() {
                return new Date(this.year, this.month, 1).getDay()
            },
            // 当前月最后一天是几号
            endDate() {
                return new Date(this.year, this.month, 0).getDate()
            },
            // 当前月的上个月的最后一天是几号
            prevEndDate() {
                return new Date(this.year, this.month - 1, 0).getDate()
            },
            // 第一行
            firstTr(){
                let arr = [];
                if (this.startDay == 0) {
                    for (let i = 0; i < 7; i++) {
                        arr.push(this.prevEndDate - 7 + i + 1);
                    }
                } else {
                    for (let i = 0; i < this.startDay; i++) {
                        arr.push(this.prevEndDate - this.startDay + i + 1);
                    }
                }
                
                for (let j = 1; j <= 7 - this.startDay; j++) {
                    arr.push(j);
                }
                return arr;
            },
            // 最后一行
            lastTr(){
                let arr = [];
                for (let i = 0; i < this.nextStartDay; i++) {
                    arr.push(this.endDate - this.nextStartDay + i + 1);
                }
                if (arr[0]) {
                    for (let j = 1; j <= 7 - this.nextStartDay; j++) {
                        arr.push(j);
                    }
                } else {
                    for (let j = 1; j <= 7; j++) {
                        arr.push(j);
                    }
                }
                return arr;
            },
            // 中间行
            trs(){
                let arr = [];
                let start = this.startDay == 0 ? 1 : this.firstTr[this.firstTr.length - 1] + 1;
                let end = this.endDate - this.nextStartDay;
                let dateNum = start;
                for (let i = 0; i < (end - start + 1) / 7; i++) {
                    arr[i] = [];
                    for (let j = 0; j < 7; j++) {
                        arr[i].push(dateNum++)
                    }
                }
                return arr;
            },
            // 生成年份选择
            yearList(){
                let years = [];
                for (let i = this.startYear; i <= this.endYear; i++) {
                    years.push(i);
                }
                return years;
            },
            // 生成小时选择
            hourList(){
                let hour = [];
                for (let i = 0; i < 24; i++) {
                    hour.push(format(i));
                }
                return hour;
            },
            // 生成分秒选择
            minuteList(){
                let minute = [];
                for (let i = 0; i < 60; i++) {
                    minute.push(format(i));
                }
                return minute;
            }
        },
        methods: {
            // 获取今天
            getToday(){
                let date = new Date();
                this.year = date.getFullYear();
                this.month = date.getMonth() + 1;
                this.chooseDate = this.year + this.separator + format(this.month) + this.separator + format(date.getDate());
                this.chooseTime = `${this.chooseDate} 00:00:00`;
            },
            // 检查日期格式
            checkDate(date){
                let dateArr = String(date).split(this.separator);
                let time = new Date(date.replace(/-/g, '/'));
                if (dateArr.length == 3 && Object.prototype.toString.call(time) === '[object Date]' && !isNaN(time.getTime())) {
                    return true;
                } else {
                    console.warn('日期格式不正确');
                    return false;
                }
            },
            // 初始化
            init(date){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
                if (date && this.checkDate(date)) {
                    if (this.showTime) {
                        let time = date.split(' ');
                        this.year = time[0].split(this.separator)[0];
                        this.month = parseInt(time[0].split(this.separator)[1]);
                        this.chooseDate = time[0];
                        this.hour = time[1].split(':')[0];
                        this.minute = time[1].split(':')[1];
                        this.second = time[1].split(':')[2];
                        this.chooseTime = date;
                    } else {
                        let dateArr = date.split(this.separator);
                        this.year = dateArr[0];
                        this.month = parseInt(dateArr[1]);
                        this.chooseDate = date;
                    }
                } else {
                    this.getToday();
                }
            },
            // 显示日历
            showCalendar(event){
                let win_height = window.innerHeight;
                this.listTop = (event.target.getBoundingClientRect().top + 320) > 0.99 * win_height;
                this.show = true;
                this.init(this.showTime ? this.chooseTime : this.chooseDate);
                this.$emit('date', this.showTime ? this.chooseTime : this.chooseDate);
                this.$emit('input', this.showTime ? this.chooseTime : this.chooseDate);
            },
            // 隐藏日历
            hideCalendar(){
                this.show = false;
            },
            // 小于起始时间的禁止点击
            lessStart(day){
                if (this.start && this.checkDate(this.start)) {
                    let start = new Date(...this.start.split(this.separator)).getTime();
                    let now = new Date(this.year, this.month, day).getTime();
//                    let now = new Date(this.year, this.month - 1, day).getTime();
                    return now < start;
                } else {
                    return false;
                }
            },
            // 大于结束时间的禁止点击
            greaterEnd(day){
                if (this.end && this.checkDate(this.end)) {
                    let end = new Date(...this.end.split(this.separator)).getTime();
//                    let now = new Date(this.year, this.month - 1, day).getTime();
                    let now = new Date(this.year, this.month, day).getTime();
                    return now > end;
                } else {
                    return false;
                }
            },
            // 点击年份
            showYear(event){
                this.showYearList = true;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = this.yearList.findIndex(item => item == this.year);
                    list_dom.scrollTop = li_height * Math.floor(index / 2);
                }, 10);
            },
            // 选择年份
            chooseYear(year){
                this.year = year;
                this.showYearList = false;
            },
            // 点击月份
            showMonth(){
                this.showYearList = false;
                this.showMonthList = true;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
            },
            // 选择月份
            chooseMonth(index){
                this.month = index + 1;
                this.showMonthList = false;
            },
            // 点击小时
            showHour(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = true;
                this.showMinuteList = false;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.hour);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择小时
            chooseHour(hour){
                this.hour = hour;
                this.showHourList = false;
            },
            // 点击分钟
            showMinute(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = true;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.minute);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择分钟
            chooseMinute(minute){
                this.minute = minute;
                this.showMinuteList = false;
            },
            // 点击秒
            showSecond(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.second);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择秒
            chooseSecond(second){
                this.second = second;
                this.showSecondList = false;
            },
            // 收起所有下拉选择
            hideListDown(){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
            },
            // 上一个月
            monthPrev(){
                if (this.year > this.startYear || this.month > 1) {
                    this.month--;
                    if (this.month < 1) {
                        this.month = 12;
                        this.year--;
                    }
                }
            },
            // 下一个月
            monthNext(){
                if (this.year < this.endYear || this.month < 12) {
                    this.month++;
                    if (this.month > 12) {
                        this.month = 1;
                        this.year++;
                    }
                }
            },
            // 上一年
            yearPrev(){
                if (this.year > this.startYear) {
                    this.year--;
                }
            },
            // 下一年
            yearNext(){
                if (this.year < this.endYear) {
                    this.year++;
                }
            },
            // 选择日期
            choose(date){
                this.chooseDate = this.year + this.separator + format(this.month) + this.separator + format(date);
                this.chooseTime = `${this.chooseDate} ${this.hour}:${this.minute}:${this.second}`;
                this.show = false;
                this.$emit('date', this.showTime ? this.chooseTime : this.chooseDate);
                this.$emit('input', this.showTime ? this.chooseTime : this.chooseDate);
            },
            // 点击今天
            chooseToday(){
                this.getToday();
                this.show = false;
                this.$emit('date', this.chooseDate);
                this.$emit('input', this.chooseDate);
            },
            getEarly(){
                this.getToday();
                this.show = false;
                this.chooseDate = this.chooseDate.substring(0,8)+'01';
                this.$emit('date', this.chooseDate);
                this.$emit('input', this.chooseDate);
            },
            // 时间选择时点击确定
            ensure(){
                this.chooseTime = this.chooseDate ? `${this.chooseDate} ${this.hour}:${this.minute}:${this.second}` : '';
                this.hideCalendar();
                this.$emit('date', this.chooseTime);
                this.$emit('input', this.chooseTime);
            },
            // 清空
            clear(){
                this.chooseDate = '';
                this.chooseTime = '';
                this.hideCalendar();
                this.$emit('date', '');
                this.$emit('input', '');
            }
        },
        watch: {
            date(date){
                this.init(date);
            }
        }
    }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import '../../../common/scss/base/variables';
    @import '../../../common/scss/base/mixin';
    
    $header-height: 40px;
    $arrow-height: 8px;
    $index-popup: 10;
    
    .slide-enter-active{
        transform: scaleY(1) rotateX(0deg);
        transition: all .2s ease;
    }
    
    .slide-leave-active{
        transform: scaleY(0) rotateX(-90deg);
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    
    .slide-enter{
        transform: scaleY(0) rotateX(90deg);
    }
    
    .calendarWrapper{
        position: relative;
        .calendar-date{
            position: relative;
            display: block;
            width: 100%;
            height: 30px;
            input[type='text']{
                position: relative;
                z-index: 2;
                width: 100%;
                height: 100%;
                border: 1px solid #dce7ed;
                background: transparent;
                text-indent: .5em;
                font-size: 12px;
                &.active{
                    border-color: $sms !important;
                }
            }
        }
        .calendar{
            position: absolute;
            top: 32px;
            left: 0;
            z-index: $index-popup;
            width: 100%;
            min-width: 340px;
            border: 2px solid $sms;
            background: #fff;
            color: #111;
            transform-origin: top;
            box-sizing: border-box;

            &.calendar-top{
                top: auto;
                bottom: 32px;
                transform-origin: bottom;
            }
            .calendar-header{
                height: $header-height;
                background: $sms;
                > div{
                    position: relative;
                    float: left;
                    width: 107px;
                    height: 24px;
                    margin: ($header-height - 24px) / 2 10px;
                }
                .list-down{
                    position: absolute;
                    top: ($header-height + 24px) / 2;
                    left: 0;
                    z-index: $index-popup + 2;
                    width: 120px;
                    max-height: 120px;
                    background: #fff;
                    border: 1px solid #ccc;
                    overflow: auto;
                    transform-origin: top;
                    box-sizing: content-box;
                    li{
                        float: left;
                        width: 50%;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        cursor: pointer;
                        &:hover{
                            background: #ccc;
                        }
                        &.active{
                            background: $sms;
                            color: #fff;
                        }
                    }
                }
                input{
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: #fff;
                    text-align: center;
                    cursor: pointer;
                }
                a{
                    position: relative;
                    float: left;
                    width: 0;
                    height: 0;
                    margin: $header-height / 2 - $arrow-height 5px 0;
                    border-top: $arrow-height solid transparent;
                    border-bottom: $arrow-height solid transparent;
                    &[class *= 'prev']{
                        border-right: $arrow-height solid #fff;
                    }
                    &[class *= 'next']{
                        border-left: $arrow-height solid #fff;
                    }
                }
                .year-prev{
                    margin-left: 15px;
                    &:after{
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: $arrow-height solid transparent;
                        border-bottom: $arrow-height solid transparent;
                        border-right: $arrow-height solid #fff;
                        position: absolute;
                        top: -$arrow-height;
                        left: 2px - $arrow-height;
                    }
                }
                .year-next{
                    margin-right: 15px;
                    &:after{
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: $arrow-height solid transparent;
                        border-bottom: $arrow-height solid transparent;
                        border-left: $arrow-height solid #fff;
                        position: absolute;
                        top: -$arrow-height;
                        right: 2px - $arrow-height;
                    }
                }
            }
            .calendar-body{
                position: relative;
                border-top: 2px solid #fff;
                border-bottom: 2px solid #fff;
                table{
                    text-align: center;
                    vertical-align: middle;
                    th{
                        width: 50px;
                        height: 30px;
                    }
                    td{
                        height: 30px;
                        input{
                            width: 100%;
                            height: 100%;
                            border: 1px solid #fff;
                            background: transparent;
                            text-align: center;
                            color: $sms;
                            box-sizing: border-box;;
                            cursor: pointer;
                            &:hover{
                                background: #f2f3f4;
                            }
                            &:disabled{
                                color: #666;
                                cursor: default;
                                &:hover{
                                    background: transparent;
                                }
                            }
                            &.active{
                                background: $sms;
                                color: #fff;
                                &:hover{
                                    background: $sms;
                                }
                            }
                        }
                    }
                }
                .mask-list-down{
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: $index-popup + 1;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0);
                }
            }
            .calendar-footer{
                padding: 8px 10px;
                background: $sms;
                text-align: center;
                input[type = 'button']{
                    margin: 0 5px;
                    padding: 2px 15px;
                    border-radius: 4px;
                    border: 0;
                    background: #fff;
                    color: #333;
                    cursor: pointer;
                }
                &.time{
                    @include clearfix();
                    span{
                        float: left;
                        margin: 0 5px;
                        height: 24px;
                        line-height: 24px;
                        color: #fff;
                        font-weight: bold;
                    }
                    input[type='button']{
                        float: right;
                        height: 24px;
                        margin: 0 5px;
                        padding: 0 8px;
                        border-radius: 4px;
                        border: 0;
                        background: #fff;
                        color: #333;
                        cursor: pointer;
                    }
                    .calendar-time{
                        position: relative;
                        float: left;
                        width: 54px;
                        height: 24px;
                        input{
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                            border: 0;
                            background: #fff;
                            font-size: 14px;
                            text-align: center;
                            &:focus{
                                border-color: $sms;
                            }
                        }
                        .list-down{
                            position: absolute;
                            bottom: 26px;
                            left: 0;
                            z-index: $index-popup + 2;
                            width: 100%;
                            max-height: 160px;
                            background: #fff;
                            border: 1px solid #ccc;
                            overflow: auto;
                            transform-origin: bottom;
                            box-sizing: content-box;
                            li{
                                width: 100%;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                cursor: pointer;
                                &:hover{
                                    background: #ccc;
                                }
                                &.active{
                                    background: $sms;
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    .mask-opacity{
        position: fixed;
        top: 0;
        left: 0;
        z-index: $index-popup - 1;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0);
    }
</style>