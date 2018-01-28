<template>
    <div class="validate" @blur.capture="validEvent" @input="validEvent">
        <slot></slot>
    </div>
</template>
<script>
    // 可校验属性列表，不验证的属性值为'false'或false时才无效
    const ATTRS = {
        // 不验证
        invalid: 'invalid',
        // 禁用的不验证
        disabled: 'disabled',
        // 必填
        required: 'required',
        // 最小长度
        minLength: 'minLength',
        // 最大长度
        maxLength: 'maxLength',
        // 固定长度
        length: 'length',
        // 数字
        number: 'number',
        // 手机号码
        tel: 'tel',
        // 座机号码
        phone: 'phone',
        // 电子邮箱
        email: 'email',
        // url
        url: 'url',
        // 正则匹配
        pattern: 'pattern',
        // 密码
        password: 'password',
        // 特殊字符
        odd: 'no-odd-char',
        // 中、英文、数字
        general: 'general'
    };

    // 正则列表
    const REGEXPS = {
        // url
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        // 邮箱
        email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]+/,
        // 时分秒
        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        // 日期
        dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
        // 手机号码
        tel: /^1[3|4|5|7|8]\d{9}$/,
        // 座机号码
        phone: /\d{3}-?\d{8}|\d{4}-?\d{7}|^400|^800/,
        // 密码(8-20字节，允许字母数字下划线)
        password: /[a-zA-Z0-9_]{7,19}$/,
//        password: /[a-zA-Z0-9_]{7,19}$/,
        // 整数
        number: /^-?[0-9]\d*$/,
        // 数字
        float: /^(-?\d+)(\.\d+)?$/,
        // 特殊字符
//        odd: /[^\a-zA-Z0-9\u4e00-\u9FA5]/
        odd: /[`~!@#\$%\^\&\*\(\)_\+<>\?"\{\},\.\\\/;'\[\]\【\】\'\"]/,
        //中、英文、数字
        general: /[\w\u4e00-\u9fa5]/,
    };


    /**
     * 是否含有某属性
     * @param dom
     * @param attr
     * @returns {boolean}
     */
    function hasAttr(dom, attr) {
        let str = dom.getAttribute(attr);
        return typeof str !== 'undefined' && str !== 'false' && str !== null;
    }


    export default{
        name: 'validate',
        props: {
            // 提示信息位置,可选top,right和bottom,默认top
            position: {
                type: String,
                'default': 'bottom'
            },
            lazy: undefined
        },
        data(){
            return {
                // 提示信息气泡
                tip: null,
                // 外层出现滚动条的dom
                scrollDom: null,
                destroying: false,
                validated: false    // 是否调用过bad方法
            }
        },
        computed: {
            handleEvents() {
                return this.validated || (this.lazy === undefined);
            }
        },
        mounted(){
            // 获取外层出现滚动条的元素
//            this.scrollDom = this.$el.offsetParent;
            this.scrollDom = document.body;
        },
        destroyed(){
            this.destroying = true;
            // 移除提示信息和事件
            this.removeWarn();
        },
        methods: {

            /**
             * 获取需要校验的元素数组
             * @return Array
             */
            validElem(){

                let domList = [];

                // 查找子元素中可校验的元素
                function getChildren(dom) {
                    let len = dom.children.length;

                    if (len > 0) {
                        while (len--) {
                            let item = dom.children[len];
                            let tag = item.tagName.toLowerCase();

                            if (tag === 'input' ||
                                tag === 'textarea' ||
                                hasAttr(item, 'contenteditable')
                            ) {
                                domList.push(item);
                            } else {
                                getChildren(item);
                            }

                        }
                    }
                }

                for (let item of this.$slots.default) {

                    if (item.tag === 'input' ||
                        item.tag === 'textarea' ||
                        (item.tag && hasAttr(item.elm, 'contenteditable'))
                    ) domList.push(item.elm);

                    if (item.elm.nodeType === 1)
                        getChildren(item.elm);

                }

                return domList;

            },
            /**
             * 显示错误提示信息
             * @param text
             * @param dom
             * @param symbol  // 用来区分不同的警告信息
             */
            showWarn(text, dom, symbol) {
                // 使用data-tip属性指定的自定义提示信息
                let warnText = dom.dataset.tip || text;
                if (dom.dataset.tip === false || dom.dataset.tip === 'false') {
                    this.removeWarn();
                    return
                }
                // target dom's position and size
                let offset = dom.getBoundingClientRect(),
                    height = offset.height;
                let tipTop = offset.top - this.scrollDom.offsetTop + this.scrollDom.scrollTop;
                let tipLeft = offset.left - this.scrollDom.offsetLeft + this.scrollDom.scrollLeft;

                if (tipLeft > this.scrollDom.clientWidth)
                    tipLeft = this.scrollDom.clientWidth;

                // 已经有提示信息, 改变其内容和位置
                if (this.tip) {
                    if (this.tip.innerText !== warnText) {
                        this.tip.innerText = warnText;
                    }
                    let [top, left] = [0, 0];
                    if (this.position === 'right') {
                        top = tipTop + (height - this.tip.offsetHeight) / 2;
                        left = tipLeft;
                    } else if (this.position === 'bottom') {
                        top = tipTop + height;
                        left = tipLeft;
                    } else {
                        top = tipTop - this.tip.offsetHeight - 3;
                        left = tipLeft - this.tip.offsetWidth;
                    }
                    if (parseInt(this.tip.style.top) !== top) {
                        this.tip.style.top = top + 'px';
                    }
                    if (parseInt(this.tip.style.left) !== left) {
                        this.tip.style.left = left + 'px';
                    }
                } else {
                    // 没有提示信息就添加
                    this.tip = document.createElement('span');
                    this.tip.className = symbol ? `validate-error-${this.position} error-${this.position}-${symbol}` : `validate-error-${this.position}`;
                    this.tip.innerText = warnText;
                    this.scrollDom.appendChild(this.tip);

                    let [top, left] = [0, 0];
                    if (this.position === 'right') {
                        top = tipTop + (height - this.tip.offsetHeight) / 2;
                        left = tipLeft;
                    } else if (this.position === 'bottom') {
                        top = tipTop + height;
                        left = tipLeft;
                    } else {
                        top = tipTop - this.tip.offsetHeight - 3;
                        left = tipLeft - this.tip.offsetWidth;
                    }

                    this.tip.style.top = top + 'px';
                    this.tip.style.left = left + 'px';

                }

                // add 'error' css class
                if (!/error/.test(dom.className))
                    dom.className = dom.className + ' error';

                // after dom manipulations above
                if (this.destroying)
                    this.removeWarn();
            },


            /**
             * 去掉提示信息
             */
            removeWarn(){
                if (this.tip) {
                    this.scrollDom.removeChild(this.tip);
                    this.tip = null;
                }
            },


            /**
             * 执行单个表单元素校验, 绑定input事件使用
             * @param event
             */
            validEvent(event){
                if (this.handleEvents)
                    if (this.validInput(event.target)) {
                        this.removeWarn();
                        event.target.className = event.target.className.replace(/error|^\s*|\s*$/g, '');
                    }
            },


            /**
             * 单个表单元素校验,不通过返回false
             * @param dom
             * @returns {boolean}
             */
            validInput(dom) {

                // 不验证,直接通过
                if (hasAttr(dom, ATTRS.invalid) || hasAttr(dom, ATTRS.disabled)) {
                    return true;
                }

                let notFormEle = hasAttr(dom, 'contenteditable');
                let value = (notFormEle ? dom.innerText : dom.value).trim();

                if (value === '') {
                    // 必填
                    if (hasAttr(dom, ATTRS.required)) {
                        this.showWarn('不能为空', dom, ATTRS.required);
                        return false;
                    }
                } else {

                    // 定长
                    if (hasAttr(dom, ATTRS.length)) {
                        let length = dom.getAttribute(ATTRS.length);
                        if (value.length != parseInt(length)) {
                            this.showWarn(`必须为${length}位`, dom, ATTRS.length);
                            return false;
                        }
                    }
                    // 最小长度
                    if (hasAttr(dom, ATTRS.minLength)) {
                        let length = dom.getAttribute(ATTRS.minLength);
                        if (value.length < parseInt(length)) {
                            this.showWarn(`最少为${length}位`, dom, ATTRS.minLength);
                            return false;
                        }
                    }
                    // 最大长度
                    if (hasAttr(dom, ATTRS.maxLength)) {
                        let length = dom.getAttribute(ATTRS.maxLength);
                        if (value.length > parseInt(length)) {
                            this.showWarn(`最多为${length}位`, dom, ATTRS.maxLength);
                            return false;
                        }
                    }

                    // 特殊字符
                    if (hasAttr(dom, ATTRS.odd)) {
                        if (REGEXPS.odd.test(value)) {
                            this.showWarn('不能含有非法字符', dom, ATTRS.odd);
                            return false;
                        }
                    }

                    switch (dom.getAttribute('type')) {
                        // 密码
                        case ATTRS.password: // SMS密码只做长度校验，其他不限制
//                            if (!REGEXPS.password.test(value)) {
//                                this.showWarn('以字母下划线开头，允许6-16个字母数字下划线', dom, ATTRS.password);
//                                return false;
//                            }
                            break;
                        // 手机号
                        case ATTRS.tel:
                            if (!REGEXPS.tel.test(value)) {
                                this.showWarn('格式不正确', dom, ATTRS.tel);
                                return false;
                            }
                            break;
                        // 电子邮箱
                        case ATTRS.email:
                            if (!REGEXPS.email.test(value)) {
                                this.showWarn('格式不正确', dom, ATTRS.email);
                                return false;
                            }
                            break;
                        // url
                        case ATTRS.url:
                            if (!REGEXPS.url.test(value)) {
                                this.showWarn('格式不正确', dom, ATTRS.url);
                                return false;
                            }
                            break;
                    }

                    // 正则
                    if (hasAttr(dom, ATTRS.pattern)) {
                        let pattern = dom.getAttribute(ATTRS.pattern);
                        if (!new RegExp(pattern).test(value)) {
                            this.showWarn('格式不正确', dom, ATTRS.pattern);
                            return false;
                        }
                    }

                }

                return true;

            },


            /**
             * 校验所有的表单元素, 最后提交时调用该方法判断是否可以提交
             * @returns {boolean}
             */
            bad() {
                this.$nextTick(() => {
                    this.validated = true;
                });

                for (let item of this.validElem()) {
                    if (!this.validInput(item))
                        return true;
                }

                return false;
            }
        }
    }

</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

    // 位于上边
    .validate-error-top {
        position: absolute;
        z-index: $index-popup;
        display: block;
        padding: 2px 6px;
        background-color: $red;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        transition: all .2s ease;
        color: #fff;
        white-space: nowrap;
    }

    // 位于右边和下边
    .validate-error-right,
    .validate-error-bottom {
        position: absolute;
        z-index: $index-popup;
        padding: 2px 0;
        text-align: center;
        color: $red;
        white-space: nowrap;
        // @include user-select(none);
    }

</style>
