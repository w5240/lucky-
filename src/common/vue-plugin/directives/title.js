/**
 * simulation of native title attribute
 * Created by naeemo on 2017/3/3.
 */

import Vue from 'vue'
import TipPrototype from '../../components/tip.vue'

const Tip = Vue.extend(TipPrototype);

let counter = null;
let tip = null;

function watcher(e) {
    
    e.stopPropagation();
    let el = e.target;
    
    // start counting
    if (tip && tip.open) {
        tip.message = el.dataset.title;
        tip.direction = el.dataset.titleDirection;
        
        // 1. get target ele position
        let {left, right, top, bottom, width, height} = el.getBoundingClientRect();
        switch (tip.direction) {
            case 'top':
                tip.$el.style.left = Math.round(left + width / 2) + 'px';
                tip.$el.style.right = '';
                tip.$el.style.top = Math.round(top - 10) + 'px';
                tip.$el.style.bottom = '';
                break;
            case 'bottom':
                tip.$el.style.left = Math.round(left + width / 2) + 'px';
                tip.$el.style.right = '';
                tip.$el.style.top = Math.round(bottom + 10) + 'px';
                tip.$el.style.bottom = '';
                break;
            case 'left':
                tip.$el.style.left = Math.round(left - 10) + 'px';
                tip.$el.style.right = '';
                tip.$el.style.top = Math.round(top + height / 2) + 'px';
                tip.$el.style.bottom = '';
                break;
            case 'right':
                tip.$el.style.left = Math.round(right + 10) + 'px';
                tip.$el.style.right = '';
                tip.$el.style.top = Math.round(top + height / 2) + 'px';
                tip.$el.style.bottom = '';
                break;
        }
    } else {
        clearTimeout(counter);
        counter = setTimeout(function () {
            clearTimeout(counter);
            
            // display tip
            tip = tip || new Tip().$mount();
            
            tip.message = el.dataset.title;
            tip.direction = el.dataset.titleDirection;
            
            // 1. get target ele position
            let {left, right, top, bottom, width, height} = el.getBoundingClientRect();
            switch (tip.direction) {
                case 'top':
                    tip.$el.style.left = Math.round(left + width / 2) + 'px';
                    tip.$el.style.right = '';
                    tip.$el.style.top = Math.round(top - 10) + 'px';
                    tip.$el.style.bottom = '';
                    break;
                case 'bottom':
                    tip.$el.style.left = Math.round(left + width / 2) + 'px';
                    tip.$el.style.right = '';
                    tip.$el.style.top = Math.round(bottom + 10) + 'px';
                    tip.$el.style.bottom = '';
                    break;
                case 'left':
                    tip.$el.style.left = Math.round(left - 10) + 'px';
                    tip.$el.style.right = '';
                    tip.$el.style.top = Math.round(top + height / 2) + 'px';
                    tip.$el.style.bottom = '';
                    break;
                case 'right':
                    tip.$el.style.left = Math.round(right + 10) + 'px';
                    tip.$el.style.right = '';
                    tip.$el.style.top = Math.round(top + height / 2) + 'px';
                    tip.$el.style.bottom = '';
                    break;
            }
            document.body.appendChild(tip.$el);
            
            tip.show();
            
        }, 100)
    }
}

function cancel() {
    clearTimeout(counter);
    tip && tip.leave();
}

export default {
    
    bind(el, binding) {
        el.addEventListener('mousewheel', function (e) {
            e.preventDefault();
        }, false);
        el.addEventListener('mouseenter', watcher, false);
        el.addEventListener('mouseleave', cancel, false);
        el.dataset.title = binding.value;
        el.dataset.titleDirection = binding.arg || 'bottom';
    },
    
    update(el, {value, oldValue}) {
        if (value !== oldValue)
            el.dataset.title = value;
    },
    
    unbind(el) {
        // cancel tip if unbinding
        cancel();
        // un-register events
        el.removeEventListener('mouseenter', watcher, false);
        el.removeEventListener('mouseleave', cancel, false);
    }
    
}
