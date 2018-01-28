<template>
    <div class="smart-input">
        <input type="text" class="placeholder" readonly> <!-- :value="isOpen ? matched.name : ''" -->
        <input type="text" class="input-field" :value="visibleVal" @input="typing"
               :required="required" maxlength="30" ref="visibleInput"
               @keydown.down.capture="pressDown" @keydown.up.capture="pressUp"
               @focus="open" @click="open" @blur="close" @keydown.enter.capture="pressEnter"
               @keydown.tab.capture="pressTab">

        <div :class="{'open': isOpen}">
            <ul v-show="sortedSources.length != 0" ref="list" :class="{'readonly': readonly}">
                <li v-for="(source, index) in sortedSources" key="id"
                    :class="{'float-active': floatIdx == index, 'current': current.id == source.id}"
                    :tabindex="index + 2" @mousedown="pick(source)">{{source.name}}
                </li>
            </ul>
            <span class="create-notice" v-show="!readonly && createNotice != ''"
                  :title="visibleVal" v-html="createNotice"></span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    import filterArrayByName from '../../common/utils/filterArrayByName'

    export default {
        props: {
            sources: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            value: {
                required: true
            },
            readonly: {
                type: Boolean
            },
            required: ''
        },
        data() {
            return {
                isOpen: false,
                sortedSources: [],
                floatIdx: -1,
                current: {},
                visibleVal: '',
                matched: {} // placeholder
            }
        },
        computed: {
            createNotice() {
                if (this.visibleVal && !this.matched.id)
                    return `创建“ <span>${this.visibleVal}</span> ”${this.title}`;
                return '';
            }
        },
        watch: {
            sources(newSrcs) {
                if (newSrcs.length != 0 && this.sortedSources.length == 0) {
                    this.sortedSources = newSrcs;

                    let source = this.sortedSources.$getByKey(this.value);
                    if (source) {
                        this.$set(this.$data, 'current', source);
                        this.$set(this.$data, 'matched', source);
                        this.visibleVal = source.name;
                    }
                }
            }
        },
        mounted() {
            this.sortedSources = this.sources;
            let source = this.sortedSources.$getByKey(this.value);
            if (source) {
                this.$set(this.$data, 'current', source);
                this.visibleVal = source.name;
            }
        },
        methods: {
            typing(e) {
                const modelVal = e.target.value.replace(/^\s*/, '');
                const hint = e.target.value.trim();

                // set visibleVal
                this.visibleVal = modelVal;

                this.isOpen = true;

                if (hint !== '') {

                    // reset
                    this.$set(this.$data, 'matched', {name: ''});
                    this.$set(this.$data, 'current', {name: ''});

                    // filter
                    let result = filterArrayByName(this.sources, hint);

                    if (result.length !== 0 && result[0]._exact) {
                        // set the best match
                        this.$set(this.$data, 'matched', result[0]);
                    }

                    this.$emit('create', hint);
                    this.$emit('input', '');
                    this.floatIdx = -1;
                    // sort sources by relevance => sortedSources
                    this.sortedSources = result;

                } else {
                    this.$set(this.$data, 'matched', {name: ''});
                    this.$emit('input', '');
                    this.$emit('create', '');
                    this.sortedSources = this.sources;
                }
            },
            pick(source){
                this.$set(this.$data, 'current', source);
                if (this.matched.id !== source.id)
                    this.$set(this.$data, 'matched', source);

                this.visibleVal = source.name;

                const e = document.createEvent('HTMLEvents');
                e.initEvent('blur', true, true);
                this.$nextTick(() => {
                    this.$refs.visibleInput.dispatchEvent(e);
                    this.isOpen = false;
                });

                this.$emit('create', '');
                this.$emit('input', source.id);
            },
            pressDown() {
                if (this.floatIdx < this.sortedSources.length - 1)
                    this.floatIdx++;

                let $list = this.$refs.list;
                let min = $list.scrollTop;
                let actualMin = 35 * this.floatIdx;
                let max = $list.scrollTop + 5 * 35;
                let actualMax = 35 * (1 + this.floatIdx);

                if (actualMin < min) {
                    $list.scrollTop = $list.scrollTop - 35;
                }

                if (actualMax > max) {
                    $list.scrollTop = $list.scrollTop + 35;
                }
            },
            pressUp() {
                if (this.floatIdx == -1)
                    this.floatIdx = this.sortedSources.length;
                if (this.floatIdx > 0)
                    this.floatIdx--;

                let $list = this.$refs.list;
                let min = $list.scrollTop;
                let actualMin = 35 * this.floatIdx;
                let max = $list.scrollTop + 5 * 35;
                let actualMax = 35 * (1 + this.floatIdx);

                if (actualMin < min) {
                    $list.scrollTop = $list.scrollTop - 35;
                }

                if (actualMax > max) {
                    $list.scrollTop = $list.scrollTop + 35;
                }
            },
            pressEnter() {
                if (this.isOpen) {
                    // if the list is open, try pick one
                    if (this.floatIdx != -1) {
                        // pick a up/down selecting source
                        this.pick(this.sortedSources[this.floatIdx]);
                    } else if (this.matched.id) {
                        this.pick(this.matched);
                    } else if (this.current.id) {
                        this.pick(this.current);
                    } else {
                        this.pick({
                            id: '',
                            name: this.visibleVal
                        })
                    }
                }
            },
            pressTab() {
                // if open and there is a match, the pick it
                if (this.isOpen && this.matched.id) {
                    this.$set(this.$data, 'current', this.matched);
                    this.visibleVal = this.matched.name;
                    this.$emit('input', this.matched.id);
                    this.$emit('create', '');
                }
            },
            open() {
                this.isOpen = true;
            },
            close() {
                this.isOpen = false;
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    @import "../scss/base/variables";
    @import "../scss/base/mixin";

    .smart-input {
        position: relative;
        vertical-align: middle;
        display: inline-block;
        @include box-sizing();
        width: -webkit-calc(100% - 6em);
        width: calc(100% - 6em);
        height: $input-field-height;
        white-space: nowrap;

        .placeholder {
            position: absolute;
            @include box-sizing();
            left: 0;
            right: 0;
            width: 100%;
            padding: 0 1em;
            border: 1px solid transparent;
            height: $input-field-height;
            line-height: $input-field-height - 2px;
            color: $color-gray-content;
        }

        .input-field {
            display: block;
            position: relative;
            z-index: 1;
            width: 100%;
            background-color: transparent;

            &:focus {
                border-bottom: 1px solid #f0f0f0;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        div {
            border-left: 1px solid $gray;
            border-right: 1px solid $gray;
            border-bottom: 1px solid $gray;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
            text-align: left;
            opacity: 0;
            @include transform(scale(.8, 0));
            @include transform-origin(50% 0);
            @include transition();
            will-change: transform, opacity;

            &.open {
                opacity: 1;
                @include transform(scale(1, 1));
            }
        }

        ul {
            max-height: $input-field-height * 5;
            overflow: auto;
            padding: 10px;
            background-color: white;

            &.readonly {
            }

            li {
                padding-left: 15px;
                color: $color-light-content;
                @include ellipsis();

                &.float-active,
                &:hover {
                    color: $color-content;
                    background-color: #f0f0f0;
                }

                &.current {
                    color: white;
                    background-color: $contact;
                }
            }
        }

        .create-notice {
            display: block;
            padding-left: 1em;
            height: 39px;
            line-height: 39px;
            color: $color-light-content;
            border: none;
            border-top: 1px solid $gray;
            text-align: left;
            background-color: #eeeeee;

            span {
                display: inline-block;
                vertical-align: top;
                max-width: 70%;
                @include ellipsis();
            }
        }

    }
</style>
