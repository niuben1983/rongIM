<template src="./template.html"></template>

<script type="text/ecmascript-6">
    'use strict';
    import './style.less';
    import Vue from "vue";
    import axios from 'axios';
    import navBar from '../../components/navbar';


    const config = CONFIG;

    export default {
        data() {
            return {
                list: [],
                current: 'dealers',
                ids: [],
                isNothing: false
            };
        },
        computed: {
            getCount() {
                let count = 0;

                this.list.forEach((item, index) => {
                    count += parseInt(item.unreadMessageCount);
                });
                return count;
            }
        },
        methods: {
            fetchData() {
                this.Chat.getToken().then((res) => {
                    this.Chat.connect(res.rongToken).then((res) => {
                        this.Chat.getConversationListPromise().then((res)=> {

                            this.isNothing = res.length == 0;
                            this.list = res;

//                            let ids = [];
//                            res.forEach(item => {
//                                ids.push(item.targetId);
//                            });
//
//                            if (ids.length < 1) return;

//                            this.fetchDealers(ids, res).then(res => {
//                                this.list = res;
//                            });
                        })
                    });
                });
            },
//            fetchDealers (ids, list){
//
//                return new Promise((resolve, reject) => {
//                    let api = config.WAPI + 'api/counselor/list';
//                    axios.get(api, {
//                        params: {
//                            ids: ids.join(','),
////                            demo: 1
//                        }
//                    }).then(res => {
//                        var _d=res.data
//                        if (res.data.code != 10000) {
//                            this.$toasted.clear();
//                            this.$toasted.show(res.data.msg);
//                            return;
//                        }
//                        for(var i=0;i<_d.data.length;i++){
//                            if(_d.data[i].dealerId==undefined || _d.data[i].dealerId==''){
//                                _d.data.splice(i,1);
//                                i--
//                            }
//
//                        }
//                        console.log(_d,'------------')
//
//                        var _arr=[]
//                        _d.data.forEach((item, index) => {
//                            for(var k=0;k<list.length;k++){
//                                if(list[k].targetId==item.id){
//                                    list[k].dealerId = item.dealerId;
//                                    list[k].dealerName = item.dealerName;
//                                    list[k].headImg = item.headImg;
//                                    list[k].id = item.id;
//                                    list[k].name = item.name;
//                                    _arr.push(list[k])
//                                }
//                            }
//
//                        });
//                        console.log(_arr,'----------')
//
//                        resolve(_arr);
//                    }).catch(err => {
//                        reject(err);
//                    });
//                });
//
//            },
            linkDetail(o){
                this.Chat.clearCount(o.latestMessage.content.extra.dealer.dealerId);
                this.$router.push({ name: 'messagesDetail', params: {dealerId: o.latestMessage.content.extra.dealer.dealerId }});
            }
        },
        components: {navBar},

        created() {
            this.fetchData();



        },
        mounted() {
        }
    };
</script>