<template src="./template.html"></template>

<script type="text/ecmascript-6">
    'use strict';
    import './style.less';
    import Vue from "vue";
    import axios from "axios";
    import { cookie } from '../../lib/utilMethods';

    const config = CONFIG;

    export default {
        props: ['positionCity', 'showProv'],
        data() {
            return {
                provs: {},
                citys: [],
                pitchProv: '',
                showCity: false
            };
        },
        computed: {},
        methods: {

            pickProv(id, name) {
                let api = config.WAPI + 'api/area/city/list';
                axios.get(api, {
                    params: {provinceId: id}
                }).then(res => {
                    if (res.data.code != 10000) return;
                    this.showCity = true;
                    this.citys = res.data.data;
                    this.pitchProv = name;
                })
            },
            pickCity (cityId, cityFullName) {
                this.showCity = false;
                this.$emit('pitch', cityId, cityFullName);
                cookie('currCity', cityFullName);
                cookie('currCityId', cityId);
            },
            fetchProvs () {
                // 直辖市 特别行政区 台湾  其他  依次为 澳门 北京 重庆 其他 台湾 天津 香港
                let zxs=[
                    '7DD917EA-1876-4C55-858F-323AB8F96ECF',
                    '6E158744-FA5E-46AE-8FF2-E66FC1AC1562',
                    '37414F4D-A80F-4055-AF85-83911A310994',
                    '3EFA148E-AB0A-458A-ACEF-B1EF85D89D77',
                    '983A842B-3131-4FC4-BE13-A842548A1625',
                    'B48CE749-0864-4AD8-853E-145CA9339BA1',
                    'F4515048-C2A6-4651-B613-85D2A48AB177',
                    '555B5632-11F8-4565-9C50-0BB13DB2D99A'
                ];
                let api = config.WAPI + 'api/area/province/list';
                axios.get(api).then(res => {
                    if (res.data.code != 10000) return;
                    let data = {};
                    for ([key] in res.data.data) {
                        data[key] = res.data.data[key].filter((o) => {
                            let val = true;
                            zxs.forEach((p) => {
                                if (p == o.id) {
                                    val = false;
                                }
                            })
                            return val;
                        });
                    }
                    this.provs = data;
                })
            },
            backProvs () {
                this.showCity = false;
            },
            hideProvs () {
                this.showCity = false;
                this.$emit('pitch');
            }
        },
        created() {

            this.fetchProvs();
        },
        mounted() {
        }
    };
</script>