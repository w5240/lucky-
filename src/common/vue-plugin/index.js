/**
 * Created by naeemo on 2016/12/1.
 */

import Toast from "../components/toast.vue";
import Modal from "../components/modal/modal.vue";
import Confirm from "../components/modal/confirm.vue";
import Selector from "../components/select.vue";
import MultiSelector from "../components/multi-select.vue";
import Validate from "../components/validate.vue";
import CrumbNav from "../components/crumb-nav.vue";
import Pager from "../components/pages.vue";
import CheckBox from "../components/checkbox.vue";
import Loading from "../components/loading.vue";
import Calendar from "../components/date-time/calendar.vue";
import MCalendar from "../components/date-time/m-calendar.vue";
import DatePicker from "../components/date-picker.vue";
import BackTop from "../components/back-top.vue";
import PreviewModal from "../components/preview-modal.vue";
import radio from "../components/radio.vue";
import Preview from "../components/preview.vue";
import PasswordInput from "../components/password-input.vue";
import SearchInput from "../components/search-input.vue";

import Title from "./directives/title";
import ScrollLoad from "./directives/scroll-load";
import CountFormat from "./countFormatFilter";
import CutSecondsTail from "./cutSecondsTail";

import mapArray from "./function/mapArray";

export default {
    install(Vue) {

        /**
         * inits other than vue
         */
        mapArray();


        /**
         * 自定义指令
         */
        Vue.directive('title', Title);
        Vue.directive('load', ScrollLoad);

        /**
         * filters
         */
        Vue.filter('count', CountFormat);
        Vue.filter('cutSeconds', CutSecondsTail);

        /**
         * confirm 确认框
         * @type {Function}
         */
        Vue.prototype.$confirm = function (title, contentHtml) {
            let theme = this.$route.matched[0].name;

            return new Promise(function (resolve, reject) {
                const newConfirm = new Vue({
                    render: function (h) {
                        return (
                            <confirm title={title} onCancel={this.cancel} onConfirm={this.sure} theme={theme}>
                                <h5 style="padding-left: 20px"> {contentHtml} </h5>
                            </confirm>
                        )
                    },
                    methods: {
                        cancel() {
                            resolve(false);
                            document.body.removeChild(newConfirm.$el);
                            newConfirm.$destroy();
                        },
                        sure() {
                            resolve(true);
                            document.body.removeChild(newConfirm.$el);
                            newConfirm.$destroy();
                        }
                    }
                }).$mount();

                document.body.appendChild(newConfirm.$el);

            })
        };


        /**
         * tip提醒, 3秒消失, 同一时间只能显示一个tip
         * success, correct: icon-correct
         * warn, error: icon-warn
         * processing: icon-processing spinning circle
         * info: icon-happy-face
         * @param message
         * @param {string} type
         */
        let toast = null;
        Vue.prototype.$toast = function (message, type = 'warn') {

            if (toast === null) {
                toast = new Vue(Toast).$mount();
                document.body.appendChild(toast.$el);
            }

            toast.message = message;
            toast.type = type;
            toast.show();
            toast.reset();

            if (type === 'processing')
                return toast;

        };

        /**
         * 预览素材的方法
         * @param material
         */
        let previewer = null;
        Vue.prototype.$preview = function (material, signature) {
            // PreviewModal
            if (previewer === null) {
                previewer = new Vue(PreviewModal).$mount();
                document.body.appendChild(previewer.$el);
            }

            previewer.material = material;
            previewer.signature = signature;
            previewer.visible = true;

        };

        Date.prototype.Format = function (fmt) { //author: meizz
            let o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        Vue.prototype.getStamp = function getStamp(dateStr) {
            if (dateStr.indexOf('-') !== -1 && dateStr.indexOf(':') === -1) {
                let [year, month, day] = dateStr.split('-');
                return (new Date(year, month, day)).getTime()
            } else if (dateStr.indexOf(':') !== -1 && dateStr.indexOf('-') === -1) {
                let [hour, minute] = dateStr.split(':');
                return hour * 60 * 60 * 1000 + minute * 60 * 1000
            }
        };

        Vue.directive('back-top', {
            inserted: (el) => {
                let back = new Vue(BackTop).$mount();
                el.addEventListener('scroll', back._checker);
                back.container = el;
                el.appendChild(back.$el);
            },
        });

        /**
         * 全局组件
         */
        Vue.component('selector', Selector); // 自定义select
        Vue.component('multi-selector', MultiSelector);
        Vue.component(Validate.name, Validate); // 校验区域
        Vue.component('crumb-nav', CrumbNav);
        Vue.component('pager', Pager);
        Vue.component('checkbox', CheckBox);
        Vue.component('loading', Loading);
        Vue.component('modal', Modal);
        Vue.component('preview', Preview);
        Vue.component('confirm', Confirm);
        Vue.component('calendar', Calendar);
        Vue.component('MCalendar', MCalendar);
        Vue.component('date-picker', DatePicker);
        Vue.component('back-top', BackTop);
        Vue.component('password', PasswordInput);
        Vue.component('search-input', SearchInput);
        Vue.component('radio', radio);

    }
}
