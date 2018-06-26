<template src="./template.html"></template>

<script type="text/ecmascript-6">
    'use strict';
    import './style.less';
    import Vue from "vue";
    import axios from "axios";

    const config = CONFIG;

    export default {
        props: ['showCar'],
        data() {
            return {
                cars: []
            };
        },
        computed: {
            getCars () {
                let cars = {};
                this.cars.forEach(item => {
                    if (!item.type)
                        item.type = '其他';
                    if (!cars[item.type])
                        cars[item.type] = [];

                    cars[item.type].push(item);

                });
                return cars;
            }
        },
        methods: {
            pickcars() {
                let api = config.WAPI + 'api/serial/list';
                axios.get(api).then(res => {
                    if (res.data.code != 10000) return;
                    this.cars = res.data.data;
                })
            },
            pickCar (item) {
                this.$emit('carPitch', item.name, item.id);
            },
            hideCars() {
                this.$emit('carPitch');
            }
        },
        created() {
            this.pickcars();
        },
        mounted() {
        }
    };
</script>