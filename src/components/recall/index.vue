<template src='./template.html'></template>

<script type='text/ecmascript-6'>
    'use strict';
    import './style.less';
    import axios from 'axios';
    const config = CONFIG;

    export default {
        props: ['mobile'],
        data() {
            return {
                getCodeBtnText : '获取验证码',
                count: 60,
            };
        },
        computed: {
            isGetCoding () {
                return this.getCodeBtnText != '获取验证码';
            }
        },
        methods: {
            send(){

                let mobile = this.mobile.replace(/(^\s+)|(\s+$)/g, '');
                if (!mobile.match(/^1[0-9a-zA-Z]{6}$/)) {
                    this.$toasted.show('验证码格式错误');
                    return false;
                }

                this.$emit('toggetRecall', false);
            },
            getCode(){
                if (this.getCodeBtnText != '获取验证码') return;
                let timer = null;
                clearInterval(timer);
                timer = setInterval(() => {
                    if (this.count <= 1){
                        this.count = 60;
                        this.getCodeBtnText = '获取验证码';
                        clearInterval(timer);
                        return;
                    }
                    this.count -= 1;
                    this.getCodeBtnText = '重发('+this.count+')';
                }, 1000);

            }
        },
        components: {},
        created() {

        },
        mounted() {
        }
    };
</script>