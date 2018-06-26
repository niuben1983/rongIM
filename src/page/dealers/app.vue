<template src="./template.html"></template>

<script type="text/ecmascript-6">
    'use strict';
    import './style.less';
    import Vue from "vue";
    import axios from "axios";
    import { cookie } from '../../lib/utilMethods';
    import navBar from '../../components/navbar';
    import selectCity from '../../components/selectCity';
    import loadFailed from '../../components/loadfailed';
    const config = CONFIG;

    export default {
        data() {

            return {
                list: [],
                chatlist: [],
                current: 'dealers',
                positionCity: '',
                currCity: '北京',
                currCityId: '',
                pointLng: '',
                pointLat: '',
                openSlectCity: false,
                count: 0,
                tabActive: 'score',
                load: true
            };
        },
        computed: {
            getMsgCount() {

                let count = 0;

                this.chatlist.forEach((item, index) => {
                    count += parseInt(item.unreadMessageCount);
                });
                return count;
            },
            getDealerCount(){

                return this.list.length;
            }
        },
        methods: {
            fetchData() {

                let api = config.WAPI + 'api/dealer/list';
                axios.get(api, {
                    params: {
                        cityId: this.currCityId,
                        cityName: this.currCity
                    }
                }).then(res => {
                    if (res.data.code != 10000) {
                        this.$toasted.clear();
                        this.$toasted.show(res.data.msg);
                        return;
                    }

                    res.data.data.forEach((o) => {
                        let pointA = new BMap.Point(this.pointLng, this.pointLat);
                        let pointB = new BMap.Point(o.log, o.lat);
                        o.distance = (BMapLib.GeoUtils.getDistance(pointA, pointB) / 1000).toFixed(1);
                    })

                    this.list = res.data.data;
                    this.sortScore();
                    this.load = true;
                }).catch(err => {
                    this.load = false;
                });
            },
            getLocation () {
                this.getBaiduLocation().then((result) => {
                    this.positionCity = result.name;
                    this.currCity = this.$route.query.city ||  cookie('currCity') || result.name;
                    this.pointLng = result.lng;
                    this.pointLat = result.lat;
                    this.fetchData();
                })
            },
            pickCurrCity () {

                this.openSlectCity = true;
            },
            pickCurrCityEnd (id, name) {

                this.openSlectCity = false;

                if (id) {
                    this.currCity = name;
                    this.currCityId = id;
                }
            },
            getChatsList(){

                this.Chat.getToken().then((res) => {
                    this.Chat.connect(res.rongToken).then((res) => {
                        this.Chat.getConversationListPromise().then((res)=> {
                            this.chatlist = res;
                        })
                    });
                });
            },
            sortScore () {

                this.tabActive = 'score';
                this.list.sort((a, b) => {
                    return (a.sortScore - b.sortScore)
                })
            },
            sortDis () {

                this.tabActive = 'distance';
                this.list.sort((a, b) => {
                    return (a.distance - b.distance)
                })
            }
        },
        watch: {

            currCityId: function () {
                this.fetchData();
            },
        },
        components: {navBar, selectCity, loadFailed},
        created() {

            if (!!this.$route.query.city) {
                cookie('currCity', this.$route.query.city);
            }

            this.fetchData();
            this.getChatsList();
            this.getLocation();
        },
        mounted() {

        }
    };
</script>