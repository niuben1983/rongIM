<template src='./template.html'></template>

<script type='text/ecmascript-6'>
    'use strict';
    import './style.less';

    export default {
        props: ['mobile'],
        data() {
            return {
            };
        },
        methods: {
            refresh(){
                this.$router.go(0);
            }
        },
        components: {},
        created() {

        },
        mounted() {
        }
    };
</script>