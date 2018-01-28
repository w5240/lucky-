<template>
    <div class="multi-select" :class="[className, {focus: !visualMode}]" @click.stop>
        <transition name="multi-select">
            <div v-if="visualMode" class="visual-mode" @mousedown.stop.prevent="open" key="visual">
                <span class="select-icon">
                    <svg role="button" width="8" height="8">
                        <use xlink:href="#icon-plus"></use>
                    </svg>
                </span>
                <span class="placeholder" v-if="selectedOptions.length === 0">选择{{title}}</span>
                <span class="selected-option" v-else v-for="option of selectedOptions" @mousedown.stop @mouseup.stop
                      :title="option.name">
                    <svg class="remove-icon" role="button" width="8" height="8" @mousedown.prevent="remove(option)">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                    {{option.name}}
                </span>
                <span v-if="selectedOptions.length" class="selected-count" @mousedown.stop>
                    已选择 <span class="journey-text">{{selectedOptions.length}}</span> 个{{title}}
                </span>
            </div>
        </transition>
        <transition name="multi-select">
            <div v-if="!visualMode" class="select-mode" key="options" @mousedown.prevent="focus">
                <p class="select-title">
                    <span class="select-icon">
                    <svg role="button" width="8" height="8">
                        <use xlink:href="#icon-plus"></use>
                    </svg>
                    </span>
                    选择{{title}}
                </p>
                <div class="keyword-input">
                    <input type="text" autofocus @blur="close" ref="input" v-model="keyword" maxlength="20"
                           autocomplete="off" aria-autocomplete="none">
                    <i class="icon icon-search"></i>
                </div>
                <ul class="options">
                    <li class="option" v-for="option of filteredOptions" @click="toggleCheck(option)"
                        :title="option.name">
                        <checkbox :value="value" @input="$emit('input', $event)" :source="option.id"></checkbox>
                        {{option.name}}
                    </li>
                </ul>
                <div class="multi-select-panel">
                    <input type="button" class="btn btn-sm btn-journey" value="确认" @mousedown.stop="close">
                </div>
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">

    import filterArrayByName from '../utils/filterArrayByName'

    export default{
        props: {
            options: {
                type: Array,
                required: true
            },
            value: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                'default': '请选择'
            },
            className: ''
        },
        data() {
            return {
                visualMode: true,   // 展示模式, false代表进入选择模式
                keyword: ''
            }
        },
        computed: {
            selectedOptions() {
                let ids = this.value.slice();
                return this.options.filter(option => ids.includes(option.id))
            },
            filteredOptions() {
                return filterArrayByName(this.options, this.keyword);
            }
        },
        methods: {
            focus() {
                this.$nextTick(() => {
                    this.$refs.input.focus();
                })
            },
            open() {
                this.visualMode = false;
                this.focus();
            },
            close() {
                this.visualMode = true;
                this.keyword = '';
            },
            remove(option) {
                let index = this.value.indexOf(option.id);
                if (index !== -1) {
                    let newVal = this.value.slice();
                    newVal.splice(index, 1);
                    this.$emit('input', newVal);
                }
            },
            toggleCheck(option) {
                let index = this.value.indexOf(option.id);
                let newVal = this.value.slice();
                index !== -1
                    ? newVal.splice(index, 1)
                    : newVal.push(option.id);
                this.$emit('input', newVal);
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .multi-select-enter-active {
        @include transition(all .2s ease);
        @include transform(scaleY(1));
    }

    .multi-select-leave-active {
        @include transition(all .2s ease);
        opacity: 1;
    }

    .multi-select-enter {
        @include transform(scaleY(0))
    }

    .multi-select-leave-to {
        opacity: 0;
    }

    .multi-select {
        $multi-select-width: 380px;

        position: relative;
        z-index: 1;
        display: inline-block;
        width: $multi-select-width;
        min-height: $input-field-height;
        margin-bottom: 15px;
        line-height: normal;
        vertical-align: top;
        text-align: left;

        &.focus {
            z-index: 10;
        }

        &.error {
            .visual-mode {
                border-color: $red;
                background-color: $light-red;
            }
        }

        .visual-mode {
            @include box-sizing();
            min-height: $input-field-height;
            padding: 2px 8px 5px 3px;
            border: 1px solid #e0e0e0;
            @include border-radius(2px);
            background-color: white;
            @include user-select(none);
            cursor: text;

            .select-icon {
                background-color: $color-light-content;
            }

            .placeholder {
                display: inline-block;
                font-size: 12px;
                color: $color-gray-content;
                margin: 5px 0 0 9px; // 1em = 9 + 3px
            }

            .selected-option {
                $selected-option-height: 20px;

                position: relative;
                display: inline-block;
                max-width: 7em;
                line-height: $selected-option-height - 2px;
                vertical-align: top;
                margin-top: 5px;
                margin-left: 5px;
                padding: 0 16px 0 4px;
                border: 1px solid #e0e0e0;
                @include ellipsis();
                @include border-radius(2px);
                background-color: $content-bg;

                .remove-icon {
                    position: absolute;
                    right: ($selected-option-height/2 - 5px);
                    top: ($selected-option-height/2 - 5px);
                    fill: $color-light-content;
                    cursor: pointer;

                    &:hover {
                        fill: $color-content;
                    }
                }
            }

            .selected-count {
                position: absolute;
                bottom: -20px;
                right: 0;
            }
        }

        .select-mode {
            position: absolute;
            top: - $input-field-height - 2px;
            left: 0;
            right: 0;
            padding: 0 10px;
            border: 1px solid $gray;
            @include border-radius(2px);
            @include box-shadow(0 3px 3px rgba(#030000, .07));
            background-color: white;
            @include transform-origin(center $input-field-height*1.5);

            .select-title {
                line-height: $input-field-height;

                .select-icon {
                    background-color: $sms;
                }
            }

            .keyword-input {
                position: relative;

                [type="text"] {
                    display: block;
                    @include box-sizing();
                    width: 100%;
                    padding: 0 30px 0 5px;
                    border: 1px solid #e0e0e0;
                    @include border-radius(2px);
                    line-height: $input-field-height - 2px;
                }

                .icon-search {
                    position: absolute;
                    right: 11px;
                    top: 11px;
                }
            }

            .options {
                overflow: auto;
                margin: 2px 0;
                max-height: $input-field-height * 5;
                line-height: $input-field-height;
                color: $color-light-content;
                @include user-select(none);

                .checkbox {
                    margin: 9px;
                    line-height: normal;
                    vertical-align: top;
                }

                li { // one option
                    cursor: pointer;
                    @include ellipsis();

                    &:hover {
                        color: $color-content;
                        background-color: #f0f0f0;
                    }
                }
            }

            .multi-select-panel {
                padding: 5px;
                border-top: 1px solid #e0e0e0;
                text-align: right;
            }
        }

        .select-icon {
            float: right;
            margin: 8px 3px 0 0;
            width: 14px;
            height: 14px;
            @include border-radius(7px);
            cursor: pointer;

            svg {
                display: block;
                margin: 3px;
                fill: white;
            }
        }
    }

</style>
