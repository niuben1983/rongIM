'use strict';

import Vue from 'vue';
import VueProgressBar from 'vue-progressbar'


Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    thickness: '3px'
});

Vue.mixin({
    beforeCreate() {
        this.$Progress.start();
    },
    mounted() {
        this.$Progress.finish();
    }
})