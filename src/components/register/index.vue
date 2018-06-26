<template src='./template.html'></template>

<script type='text/ecmascript-6'>
    'use strict';
    import './style.less';
    import Vue from 'vue';
    import Router from 'vue-router';
    import axios from 'axios';
    import { cookie } from '../../lib/utilMethods';
    import selectCity from '../selectCity';
    import selectCar from '../selectCar';
    Vue.use(Router);

    const config = CONFIG;

    export default {
        props: ['svrInfo'],
        data() {
            return {
                positionCity: '',
                currCity: '请选择地区',
                currCityId: '',
                currCar: '请选择您要购买车型',
                currCarId: '',
                openSlectCity: false,
                openSlectCar: false,
                userName: '',
                userPhone: ''
            };
        },
        computed: {
            currCarStyle () {
                return this.currCar == '请选择您要购买车型' ? '#c6c6c6' : '#333';
            },
            currCityStyle () {
                return this.currCity == '请选择地区' ? '#c6c6c6' : '#333';
            }
        },
        methods: {
            getLocation () {

                this.getBaiduLocation().then((result) => {
                    this.positionCity = result.name;
                })
            },
            getCookieCity () {
                this.currCity= cookie('currCity') || '请选择地区';
                this.currCityId = cookie('currCityId');
            },
            pickCurrCity () {
                this.openSlectCity = true;
            },
            pickCurrCityEnd (id, name) {
                this.openSlectCity = false;
                if (id){
                    this.currCity = name;
                    this.currCityId = id;
                }
            },
            pickCar () {
                this.openSlectCar = true;
            },
            pickCarEnd (name, id) {
                this.openSlectCar = false;
                if (name, id){
                    this.currCar = name;
                    this.currCarId = id;
                }
            },
            send () {
                this.$toasted.clear();
                if (this.currCar == '请选择您要购买车型' ) {
                    this.$toasted.show('请选择您要购买车型');
                    return false;
                }

                let userName = this.userName.replace(/(^\s+)|(\s+$)/g, '');
                if (!userName.match(/^[\u4e00-\u9fa5]{2,8}$/)) {
                    this.$toasted.show('姓名输入错误，请输入2-8个汉字');
                    return false;
                }
                let userPhone = this.userPhone.replace(/(^\s+)|(\s+$)/g, '');
                if (!userPhone.match(/^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/)) {
                    this.$toasted.show('手机号格式错误');
                    return false;
                }

                if (this.currCity == '请选择地区' ) {
                    this.$toasted.show('请选择地区');
                    return false;
                }

                this.$emit('toggetRegister', false, {
                    name: this.userName,
                    mobile: this.userPhone,
                    car: this.currCar,
                    carId: this.currCarId,
                    city: this.currCity,
                    cityId: this.currCityId

                });
            },
            closeReg () {
                this.$emit('toggetRegister', false);
            }
        },
        components: {selectCity, selectCar},
        created() {
            this.getLocation();
            this.getCookieCity();
        },
        mounted() {
        }
    };
</script>