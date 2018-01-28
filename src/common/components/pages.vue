<template>
    <div class="pages-box" v-if="total > 0">
        <ul class="pages" :class="className">
            <li class="pages-prev">
                <span class="icon icon-arrow-left" v-if="pageNow == 1"></span>
                <a v-else class="icon icon-arrow-left" href="javascript:void(0);" @click="prevClick"></a>
            </li>
            <!--如果只有一页就不显示固定的第一个分页按钮了,避免重复-->
            <template v-if="pageTotal > 1">
                <li v-for="i in pageBegin" class="pages-li" :class="{active:i == pageNow}">
                    <span v-if="i == pageNow" v-text="i"></span>
                    <a v-else @click="pageClick(i)" v-text="i"></a>
                </li>
            </template>
            <li class="left-rest" v-if="ellipsis[0] > slider">
                <span>...</span>
            </li>
            <li v-for="i in pageMiddle" class="pages-li" :class="{active:i == pageNow}">
                <span v-if="i == pageNow" v-text="i"></span>
                <a v-else @click="pageClick(i)" v-text="i"></a>
            </li>
            <li class="right-rest" v-if="pageTotal - ellipsis[1] > slider">
                <span>...</span>
            </li>
            <li v-for="i in pageEnd" class="pages-li" :class="{active:i == pageNow}">
                <span v-if="i == pageNow" v-text="i"></span>
                <a v-else @click="pageClick(i)" v-text="i"></a>
            </li>
            <li class="pages-next">
                <span v-if="pageNow == pageTotal" class="icon icon-arrow-right"></span>
                <a v-else class="icon icon-arrow-right" @click="nextClick"></a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        props: {
            // 总页数
            total: {
                type: [Number, String],
                required: true
            },
            // 当前页
            now: {
                type: [Number, String],
                default: 1
            },
            // 修改样式使用的class名
            className: {
                type: String,
                default: 'big'
            }
        },
        data() {
            return {
                //总页数
                pageTotal: this.total,
                //输入的页码
                pageNum: "",
                //显示分页按钮的个数
                length: 8,
                //前后固定的分页按钮个数
                slider: 1
            }
        },
        watch: {
            total(val){
                let page_total = parseInt(val);
                page_total = (isNaN(page_total) || page_total < 1) ? 1 : page_total;
                this.pageTotal = page_total;
            }
        },
        computed: {
            //当前页
            pageNow() {
                let page_now = parseInt(this.now);
                page_now = (isNaN(page_now) || this.total < 2 || page_now < 1) ? 1 : page_now;
                page_now = page_now > this.total ? this.total : page_now;
                return page_now;
            },
            //前边显示固定分页数
            pageBegin(){
                return Math.min(this.slider, this.ellipsis[0]);
            },
            //中间显示分页数
            pageMiddle(){
                let arr = [];
                for (let i = this.ellipsis[0] + 1; i <= this.ellipsis[1]; i++) {
                    arr.push(i);
                }
                return arr;
            },
            //后边显示分页数
            pageEnd(){
                let arr = [];
                for (let i = this.ellipsis[2] + 1; i <= this.pageTotal; i++) {
                    arr.push(i);
                }
                return arr;
            },
            /**
             * 出现三个点时的分页的范围
             * @returns {*[]}
             * begin: 开始页码
             * end: 结束页码
             * end_max: 结束页码的最大值
             */
            ellipsis() {
                let end_max = this.pageTotal - this.slider;
                let begin = this.pageNow - (this.length / 2) + this.slider;
                begin = begin < 1 ? 1 : begin;
                let end = begin + this.length - 2 * this.slider;
                //当begin达到最小值后需要根据begin重新计算end以保证显示的分页按钮个数不变
                end = begin < this.slider ? (end + this.slider - begin) : end;
                if (end >= end_max) {
                    end = end_max;
                    //当end达到最大值后需要根据end重新计算begin以保证显示的分页按钮个数不变
                    begin = (end - this.length + 2 * this.slider) < 1 ? 1 : (end - this.length + 2 * this.slider);
                }
                return [begin, end, end_max];
            }
        },
        methods: {
            //上一页
            prevClick() {
                let no = this.pageNow - 1;
                if (no < 1) no = 1;
                this.$emit('page', no);
            },
            //下一页
            nextClick() {
                let no = this.pageNow + 1;
                if (no > this.pageTotal) no = this.pageTotal;
                this.$emit('page', no);
            },
            //点击页码
            pageClick(no) {
                this.$emit('page', no);
            },
            //输入页码
            pageInput(e){
                let num = parseInt(e.target.innerText);
                if (isNaN(num)) {
                    this.pageNum = '';
                    e.target.innerText = '';
                } else {
                    this.pageNum = num;
                    //e.target.innerText = num;
                }
            },
            //跳转到输入的页码
            goClick() {
                this.pageNum = this.pageNum < 1 ? 1 : this.pageNum;
                this.pageNum = this.pageNum > this.pageTotal ? this.pageTotal : this.pageNum;
                this.pageNow = this.pageNum;
                this.pageNum = "";
                this.$emit('page', this.pageNow);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    @import '../scss/base/variables';
    @import '../scss/base/mixin';

    .pages-box {
        @include clearfix();
    }

    .pages {
        margin: 5px auto;
        padding: 10px 0;
        @include user-select(none);
        @include clearfix();

        &.right {
            float: right;
        }

        &.big {
            $size: 35px;

            font-size: 14px;

            li {
                @include box-sizing();
                float: left;
                min-width: $size;
                height: $size;
                border: 1px solid #e0e0e0;
                line-height: $size;
                text-align: center;

                &.active {
                    color: white;
                }
                @at-root {
                    .contact-theme &.active,
                    .material-theme &.active {
                        border-color: $contact;
                        background-color: $contact;
                    }

                    .journey-theme &.active {
                        border-color: $sms;
                        background-color: $sms;
                    }

                    .sms-theme &.active,
                    .mms-theme &.active {
                        border-color: $sms;
                        background-color: $sms;
                    }
                }

                + li {
                    border-left: none;
                }

                span {
                    @include box-sizing();
                    display: block;
                    width: 100%;
                    padding: 0 5px;
                    height: 100%;
                    cursor: default;
                }

                a {
                    @include box-sizing();
                    display: block;
                    width: 100%;
                    padding: 0 5px;
                    height: 100%;
                    color: $color-content;
                    cursor: pointer;

                    @at-root {
                        .contact-theme &:hover,
                        .material-theme &:hover {
                            color: $contact;
                        }

                        .sms-theme &.hover,
                        .mms-theme &.hover {
                            color: $sms;
                        }

                        .journey-theme &:hover {
                            color: $sms;
                        }
                    }
                }
            }

            .left-rest {
                border: none;
                border-right: 1px solid #e0e0e0;
            }

            .right-rest {
                border: none;
                border-right: 1px solid #e0e0e0;
            }

            .pages-prev,
            .pages-next {
                background-color: #f0f0f0;

                a {

                }
            }

            .pages-prev {
                border-top-left-radius: 3px;
                border-bottom-left-radius: 3px;
            }
            .pages-next {
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px;
            }

        }

        &.sm {
            $size: 30px;

            li {
                @include box-sizing();
                float: left;
                min-width: $size;
                height: $size;
                line-height: $size;
                text-align: center;

                @at-root {
                    .contact-theme &.active,
                    .material-theme &.active {
                        color: $contact;
                    }

                    .sms-theme &.active,
                    .mms-theme &.active {
                        color: $sms;
                    }

                    .journey-theme &.active {
                        color: $sms;
                    }
                }

                &.pages-li {
                    a:hover {
                        text-decoration: underline;
                    }
                }

                span {
                    cursor: default;
                }

                a {
                    display: block;
                    width: 100%;
                    height: 100%;
                    color: $color-content;

                    @at-root {
                        .contact-theme &:hover,
                        .material-theme &:hover {
                            color: $contact;
                        }

                        .sms-theme &.hover,
                        .mms-theme &.hover {
                            color: $sms;
                        }

                        .journey-theme &:hover {
                            color: $sms;
                        }
                    }
                }
            }

        }

        .pages-prev,
        .pages-next {
            span {
                color: $gray;
                cursor: not-allowed;
            }
        }

    }
</style>
