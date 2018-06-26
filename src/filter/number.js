'use strict';
import Vue from 'vue';

Vue.filter('maxCount', function (value) {

    return value > 99 ? 99 : value;

});

