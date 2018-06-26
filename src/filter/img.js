'use strict';
import Vue from 'vue';
const config = CONFIG;
const defaultImg = CONFIG.PUBLICPATH + 'img/user.png';

Vue.filter('imgDefault', function (value) {

    return !!value ? value: defaultImg;

});

