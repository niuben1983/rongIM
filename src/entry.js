'use strict';
import Vue from 'vue'
import App from './App'

import router from './router'
import Promise from 'promise-polyfill';
window.Promise = Promise;

import './mixin';
import './filter';
import util from './lib/utilInjection';
import chat from './lib/chat';
import VueScroller from 'vue-scroller'
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
    position: 'top-center',
    duration: 2000
});
Vue.use(VueScroller);
Vue.use(util);
Vue.use(chat);

//实现：active
document.body.addEventListener('touchstart', function () { });

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
