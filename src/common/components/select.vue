<template>
    <div :class="['selector', className]">
        <label class="select-text">
            <input type="text" readonly :class="{active: show}" :value="selectedOpt.name" :disabled="!!disabled"
                   ref="text_dom"
                   :placeholder="placeholder"
                   @mousedown="showList"
                   @focus="showList"
                   @blur="hideList">
            <div>
                <span class="select-icon"></span>
            </div>
        </label>
        <transition name="drop">
            <div ref="list" class="list-container" :class="[show ? 'in':'out',originTop ? 'originTop':'originBottom']"
                 :style="{'top':listTop+'px'}">
                <ul class="select-list" ref="list_dom" @scroll="scrolling"
                    :class="{'none-above': noneAbove !== undefined}">
                    <li class="search-field" v-if="search">
                        <input type="text" ref="search" v-model="keyword" :placeholder="'关键字搜索'"
                               @blur="hideList" autofocus>
                        <span class="icon icon-search" @mousedown.prevent></span>
                    </li>
                    <li v-for="(opt, index) in filteredOptions" :title="opt.name" v-if="opt.id !== noneAbove">
                        <input type="text" readonly :value="opt.name" :disabled="opt.disabled"
                               :class="{selected: opt.id === selectedOpt.id}"
                               @mousedown="show && change(opt)">
                    </li>
                    <li class="option-null" v-if="filteredOptions.length === 0">
                        没有找到"<span>{{keyword}}</span>"相关选项
                    </li>
                </ul>
                <span v-if="noneAbove !== undefined" @mousedown="change(options.$getByKey(noneAbove))"
                      class="none-above-option"> {{options.$getByKey(noneAbove).name}} </span>
            </div>
        </transition>
    </div>
</template>
<script type="text/babel">

    import filterArrayByName from '../../common/utils/filterArrayByName'

    export default {
        props: {
            //下拉列表项
            options: {
                type: Array,
                required: true
            },
            //class名,修改样式使用
            className: {
                type: String,
                default: ''
            },
            //提示信息
            placeholder: {
                type: String,
                default: '请选择'
            },
            //是否禁用select
            disabled: {
                default: false
            },
            search: {
                type: Boolean,
                'default': false
            },
            nowPage: {
                type: Number,
                default: 1
            },
            totalPage: {
                type: Number,
                default: 1
            },
            trim: {
                type: Boolean,
                'default': true
            },
            //默认选中的选项
            value: '',
            noneAbove: undefined
        },
        data() {
            return {
                show: false,
                originTop: true,
                listTop: false,
                keyword: '',
            }
        },
        computed: {
            filteredOptions() {
                if (this.trim) {
                    if (this.keyword.trim() === '') return this.options;
                } else {
                    if (this.keyword === '') return this.options;
                }
                return filterArrayByName(this.options, this.trim ? this.keyword.trim() : this.keyword);
            },
            selectedOpt() {
                return this.options.$getByKey(this.value) || {name: '', id: ''};
            }
        },
        watch: {},
        beforeDestroy() {
        },
        mounted() {
        },
        methods: {
            focusInSearch() {
                this.$refs.search.focus();
            },
            // 显示下拉列表
            showList(event) {
                if (this.options.length === 0) return;
                let text_dom = this.$refs.text_dom;
                let list_dom = this.$refs.list_dom;
                let opt_num = Math.min(5, list_dom.children.length);
                let all_height = (text_dom.clientHeight + 2) * opt_num + 6 + 2;
                this.originTop = document.documentElement.clientHeight - text_dom.getBoundingClientRect().bottom > all_height;
                this.listTop = this.originTop ? text_dom.clientHeight + 3 : -all_height;
                this.show = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let opt_height = list_dom.firstElementChild.clientHeight;
                    let index = this.options.findIndex(item => item.id === this.selectedOpt.id);
                    list_dom.scrollTop = opt_height * (index - 1);
                }, 10);

                if (this.search) this.focusInSearch();
            },
            // 隐藏下拉列表
            hideList(e) {
                if (this.search) {
                    if (e.target === this.$refs.search) {
                        this.show = false;
                        this.keyword = '';
                    }
                } else {
                    this.show = false;
                }
            },
            // 选择一个列表项
            change(option) {
//                this.hideList();

                if (this.selectedOpt.id !== option.id) {
                    this.$emit('input', option.id);
                }
                this.$emit('select', option);
            },
            scrolling(e) {
                if (this.nowPage < this.totalPage) {
                    let el = this.$refs.list_dom;
                    if (el.scrollHeight - el.clientHeight - el.scrollTop < 1) {
                        this.$emit('bottomReached');
                    }
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

    $option-height: $input-field-height;

    @keyframes out {
        to {
            transform: scaleY(0);
        }
    }

    @keyframes in {
        to {
            transform: scaleY(1);
        }
    }

    .out {
        @include animation(out .2s linear);
        -webkit-animation-fill-mode: forwards;
        -moz-animation-fill-mode: forwards;
        -o-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
    }

    .in {
        @include animation(in .2s linear);
        -webkit-animation-fill-mode: forwards;
        -moz-animation-fill-mode: forwards;
        -o-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
    }

    .selector {
        display: inline-block;
        position: relative;
        &.block {
            display: block;
        }

        &.lg {
            min-width: 200px;
        }

        &.error {
            .select-text input[type="text"] {
                border-color: $light-red;
                background-color: $light-red;
            }
        }

        + span {
            margin-left: 5px;
        }

        .select-text {
            position: relative;
            display: block;
            width: 100%;
            border-radius: 4px;
            box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.07);

            input[type="text"] {
                position: relative;
                @include box-sizing();
                z-index: 2;
                width: 100%;
                height: $option-height;
                padding-right: 20px;
                border: 1px solid #e0e0e0;
                @include border-radius(2px);
                text-indent: 15px;
                line-height: $option-height - 2px;
                color: $color-content;
                @include user-select(none);
                @include transition(.3s all);

                &:not([disabled]) {
                    cursor: pointer;
                }

                &.active,
                &:focus, &:hover {
                    border: 1px solid $color-gray-content;
                    border-bottom-right-radius: 0;
                    border-bottom-left-radius: 0;
                    outline: none;

                    + div .select-icon {
                        border-top-color: $color-content;
                    }
                }
            }

            div {
                height: $option-height - 2px;
                width: $option-height - 2px;
                background-color: $select-arrow;
                position: absolute;
                z-index: 2;
                top: 1px;
                right: 1px;

                .select-icon {
                    $offset: ($option-height - 8px) / 2;
                    position: absolute;
                    right: $offset;
                    top: 50%;
                    z-index: 2;
                    display: block;
                    width: 0;
                    height: 0;
                    margin-top: -3px;
                    border-top: 6px solid $color-light-content;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    @include transition(border-color .2s ease);
                    cursor: pointer;
                }
            }
        }

        .list-container {
            position: absolute;
            @include box-sizing();
            left: 0;
            width: 100%;
            border: 1px solid $gray;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
            background-color: white;
            font-size: 12px;
            z-index: 3;
            @include transform(scale(0));
            @include box-shadow(0 3px 3px rgba(#030000, .07));

            &.originTop {
                @include transform-origin(top);
            }

            &.originBottom {
                @include transform-origin(bottom);
            }
            &.list-top {
                top: auto;
                bottom: $option-height + 5px;
                @include transform-origin(top);
            }

            .select-list {
                max-height: $option-height * 6 + 6px;
                padding: 3px 0;
                overflow: auto;

                .option-null {
                    color: $yellow;
                    font-weight: normal;
                    background: $light-yellow;
                    display: block;
                    width: 100%;
                    padding: 0 15px;
                    font-size: 12px;
                    line-height: 35px;
                    box-sizing: border-box;
                    @include transition(all 0.3s ease);

                    span {
                        @include ellipsis;
                        display: inline-block;
                        vertical-align: bottom;
                        max-width: calc(100% - 9em);
                    }
                }
                &.none-above {
                    padding-bottom: 0;
                }
            }

            .search-field {
                position: relative;
                margin: 3px 0;

                .icon-search {
                    $offset: ($option-height - 14px) / 2;
                    position: absolute;
                    width: $option-height - 2px;
                    height: $option-height - 2px;
                    line-height: $option-height;
                    text-align: center;
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                    right: 1px;
                    top: 1px;
                    font-size: 14px;
                    background-color: white;
                }
            }

            li {
                display: block;
                height: $option-height;
            }

            input[type='text'] {
                @include box-sizing();
                width: 100%;
                padding: 0 1em;
                text-align: left;
                color: $color-light-content;
                @include ellipsis();

                &[readonly] {
                    border: 0;
                    cursor: pointer;
                    line-height: $option-height;

                    &:hover:not(.selected) {
                        color: $color-content;
                        background-color: #e1e1e1;
                    }
                }

                &:not([readonly]) {
                    border: 1px solid #e0e0e0;
                    padding: 8px;
                    line-height: $option-height - 18px;
                    border-radius: 2px;

                    &:focus {
                        border-color: $gray;
                    }
                }

                &[disabled] {
                    background-color: transparent;
                    color: $color-gray-content;
                    cursor: not-allowed;
                }

                &.selected {
                    color: white;
                    background-color: $sms;
                }
            }
        }

        .none-above-option {
            display: block;
            padding-left: 15px;
            height: 44px;
            border-top: 1px solid $gray;
            background-color: $content-bg;
            line-height: 44px;
            cursor: pointer;
        }
    }

</style>
