'use strict';
import Vue from 'vue';

Vue.filter('formatEmoji', function (value) {
    return RongIMLib.RongIMEmoji.symbolToEmoji(value);
});
