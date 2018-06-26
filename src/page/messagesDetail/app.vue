<template src="./template.html"></template>

<style lang='less' scoped>
    @import './style.less';
</style>

<script type="text/ecmascript-6">
    'use strict';

    import Vue from "vue";
    import lrz from "lrz";
    import { cookie, trim } from '../../lib/utilMethods';
    import emoji from '../../components/emoji';
    import register from '../../components/register';
    import recall from '../../components/recall';
    import axios from "axios";

    const config = CONFIG;
    const defaultImg = CONFIG.PUBLICPATH + 'img/user.png';

    export default {
        data() {
            return {
                dealerInfo: {},
                userInfo: {},
                list: [],
                current: 'dealers',
                preMsg: '',
                showPicBox: false,
                showEmoji: false,
                showRegister: false,
                site: 'beijing',
                isFrist: false,
                isrefresh: true,
//                updateTips: false,
                targetId: '',
                recallMobile: '',
                showRecall: false,
                showFancyBox: false,
                fancyImgUrl: '',
                fancyImg: {
                    w: 'auto',
                    h: 'auto',
                    mt: '0px',
                    ml: '0px'
                }
            };
        },
        computed: {},
        methods: {
            scrollToBottom () {
                this.$nextTick(() => {
                    if (this.$refs.myscroller) {
                        this.$refs.myscroller.resize();
                        this.$refs.myscroller.scrollTo(0, this.$refs.myscrollerBox.clientHeight, false);
                    }
                })
            },
            clickEmoji(target) {
                this.preMsg += target.getAttribute("name");
            },
            switchEmoji() {
                this.showEmoji = !this.showEmoji;
                this.showPicBox = false;
            },
            switchPicBox() {
                this.showPicBox = !this.showPicBox;
                this.showEmoji = false;
            },
            focusPreMsg () {
//                this.showEmoji = false;
//                this.showPicBox = false;
            },
            generateUUID() {
                let d = new Date().getTime();
                let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },
            creatExtra (txtMsgType, xyMsgId) {
                let id = !!xyMsgId ? xyMsgId : this.generateUUID();
                return {
                    counselor: {
                        headImg: this.dealerInfo.headImg,
                        id: this.dealerInfo.id,
                        name: this.dealerInfo.name
                    },
                    dealer: {
                        dealerId: this.dealerInfo.dealerId,
                        dealerName: this.dealerInfo.dealerName,
                        dealerPic: this.dealerInfo.url
                    },
                    user: {
                        id: this.userInfo.id
                    },
                    txtMsgType: txtMsgType,
                    xyMsgId: id
                };
            },
            // update 更新虚拟消息列表
            updateMsgList (content, msgType) {
                //msgType: 1 文本， 2 图片
                let message;
                // state 1 为发送中 2发送成功 3发送失败
                if (msgType == 1) {// 文本消息
                    message = {
                        content: content,
                        senderUserId: this.userInfo.id + "",
                        sentTime: Date.now(),
                        state: 1,
                        messageType: "TextMessage"
                    };
                } else if (msgType == 2) {// 图片消息
                    message = {
                        content: content,
                        senderUserId: this.userInfo.id + "",
                        sentTime: Date.now(),
                        state: 1,
                        messageType: "ImageMessage"
                    };
                }

//                if (!this.Chat.hasConnect) {
//                    message.state = 3
//                }
                try {
                    message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(content.content);
                } catch (e) {
                    console.log(e)
                }

                this.list.push(message);
                this.modifyMessage(this.list, this.targetId);

            },
            // 发送消息成功后更新state
            succAfterUpdate(res) {
                try {
                    res.content.extra = JSON.parse(res.content.extra)
                    let xyMsgId = res.content.extra.xyMsgId;
                    let list = this.list;
                    for (let i = 0; i < list.length; i++) {
                        if (typeof list[i].content.extra == "string") {
                            list[i].content.extra = JSON.parse(list[i].content.extra)
                        }
                        if (!list[i].content.extra || !list[i].content.extra.xyMsgId) {
                            continue;
                        }
                        if (list[i].content.extra.xyMsgId == xyMsgId) {
                            list[i].state = 2
                            let _d = list.splice(i, 1)[0]
                            list.push(_d)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            },
            // 发送消息失败后更新state
            catchAfterUpdate() {
                var list = this.list;
                // var xyMsgId = JSON.parse(err.message.content.extra).xyMsgId;
                // console.log(xyMsgId, '---------------------------xyMsgId')

                try {
                    for (var i = 0; i < list.length; i++) {
                        if (!list[i].content.extra || !list[i].content.extra.xyMsgId) {
                            continue;
                        }
                        // if ((list[i].content.extra.xyMsgId == xyMsgId || list[i].state == 1) && list[i].state != 2) {
                        //     list[i].state = 3;
                        // }
                        if (list[i].state == 1) {
                            list[i].state = 3;
                        }
                    };
                    this.modifyMessage(list, this.targetId);
                } catch (e) {
                    alert(e);
                    console.log(e)
                }
            },
            sendMsg () {

                if (trim(this.preMsg) == '') {
                    return;
                }
                let _extra = this.creatExtra(0);

                this.updateMsgList({
                    content: this.preMsg,
                    extra: _extra
                }, 1);


                this.Chat.sendMessage(this.targetId, RongIMLib.RongIMEmoji.symbolToEmoji(this.preMsg), _extra).then((res) => {
                    this.succAfterUpdate(res);

                    this.list = this.modifyMessage(this.list, this.targetId);
                    this.preMsg = '';
                    this.showEmoji = false;
                }, (err) => {
                    //发送失败处理
                    this.catchAfterUpdate();
                });

                this.scrollToBottom();

            },
            sendImgMsg (imageUri, base64Str) {

                let _extra = this.creatExtra(0);

                this.updateMsgList({
                    content: base64Str,
                    extra: _extra,
                    imageUri: imageUri,
                    messageName: 'ImageMessage'
                }, 2);


                this.Chat.sendImgMessage(this.targetId, base64Str, imageUri, _extra).then((res) => {

                    this.succAfterUpdate(res);

                    this.list = this.modifyMessage(this.list, this.targetId);
                    this.showEmoji = false;
                }, (err) => {

                    this.catchAfterUpdate();
                });
                this.scrollToBottom();

            },
            againSendMsg(xyMsgId, msgType){
                //msgType: 1 文本， 2 图片
                console.log(xyMsgId);
                let list = this.list;
                let _msg = null;
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].content.extra || !list[i].content.extra.xyMsgId) {
                        continue;
                    }
                    if (list[i].content.extra.xyMsgId == xyMsgId) {
                        list[i].state = 1;
                        _msg = list[i];
                        break
                    }
                }

                this.Chat.reconnect(this.targetId, 0).then(res => {
                    let _extra = this.creatExtra(_msg.content.extra.txtMsgType, _msg.content.extra.xyMsgId);

                    msgType == 1 ? this.Chat.sendMessage(this.targetId, RongIMLib.RongIMEmoji.symbolToEmoji(_msg.content.content), _extra).then((res) => {
                        this.succAfterUpdate(res);

                        this.list = this.modifyMessage(this.list, this.targetId);
                        this.preMsg = '';
                        this.showEmoji = false;
                    }) : '';

                    msgType == 2 ? this.Chat.sendImgMessage(this.targetId, _msg.content.content, _msg.content.imageUri, _extra).then((res) => {

                        this.succAfterUpdate(res);

                        this.list = this.modifyMessage(this.list, this.targetId);
                        this.showEmoji = false;
                    })  : '';

                }, err => {

                    this.catchAfterUpdate();

                });

            },
            getMessages () {

                if (!this.isrefresh) {
                    this.isFrist = true;
                    this.$refs.myscroller.finishPullToRefresh();
                    return;
                }

                this.isrefresh = false;

                let userId = this.$route.query.userId;
                let _this = this;


                this.Chat.getToken(userId).then(res => {
                    //得到用户信息

                    _this.userInfo = res;

                    _this.fetchDealerInfo().then(() => {
                        _this.Chat.connect(res.rongToken, _this.targetId, 0).then(() => {

                            _this.Chat.clearCount(_this.targetId);
                            _this.Chat.getHistoryMessagesPromise().then((res) => {
                                console.log('历史消息', res)
                                _this.isFrist = !res.hasMsg;

                                _this.list = _this.modifyMessage(res.data, _this.targetId);
                                _this.isrefresh = res.hasMsg;
                                _this.scrollToBottom();
                            });
                        });
                    });
                });
            },
            refresh(){

                if (!this.isrefresh) {
                    this.isFrist = true;
                    this.$refs.myscroller.finishPullToRefresh();
                    return;
                }
                this.isrefresh = false;
                this.Chat.getToken().then((res) => {
                    this.Chat.connect(res.rongToken, this.targetId).then(() => {
                        this.Chat.getHistoryMessagesPromise().then((res) => {
                            console.log(1212, res);
                            this.isFrist = !res.hasMsg;
                            let data = this.modifyMessage(res.data, this.targetId);

                            this.list = data.concat(this.list);
                            this.isrefresh = res.hasMsg;

                            this.$nextTick(() => {
                                if (!this.$refs.myscroller) return;
                                this.$refs.myscroller.finishPullToRefresh();

                                this.$refs.myscroller.resize();
//                                this.$refs.myscroller.scrollTo(0, 300, true);

                            })
                        });
                    });
                });
            },
            fetchDealerInfo () {
//                经销商信息、targetId;
                let _this = this;
                return new Promise((resolve, reject) => {
//                    if (_this.$route.params.targetId != 0) {
//                        _this.targetId = _this.$route.params.targetId;
//                        resolve();
//                    }

//                    自动分配
                    if (_this.$route.params.dealerId != 0) {
                        let api = config.WAPI + 'api/counselor/dispatch';
                        axios.get(api, {
                            params: {
                                customerId: _this.userInfo.id,
                                dealerId: _this.$route.params.dealerId
                            }
                        }).then(res => {
                            if (res.data.code != 10000) {
                                this.$toasted.clear();
                                this.$toasted.show(res.data.msg);
                                return;
                            }
                            res.data.data.headImg = res.data.data.headImg || defaultImg;
                            _this.dealerInfo = res.data.data;
                            cookie('currCity', res.data.data.city);
                            cookie('currCityId', res.data.data.cityId);

                            resolve();
                        }).catch(err => {
                            this.$toasted.show(err);
                        });
                    }
                })

            },
            closeUpdateTips () {
//                this.updateTips = false;
                let api = config.WAPI + 'api/counselor/dispatch';
                axios.get(api, {
                    params: {
                        customerId: this.userInfo.id,
                        dealerId: this.$route.params.dealerId
                    }
                });
            },
            //提交留资
            toggetRegister (flag, info) {
                if(this.dealerInfo.todayLeadsState){
                    this.showRegister = flag;
                    return;
                }

                if (!!info) {

                    let api = config.WAPI + 'api/customer/save';
                    axios.get(api, {
                        params: {
                            source: 1,
                            customerId: this.userInfo.id,
                            dealerId: this.$route.params.dealerId,
                            seriesId: info.carId,
                            cityId: info.cityId,
                            name: info.name,
                            phone: info.mobile,
                            counselorId: this.dealerInfo.id
                        }
                    }).then(res => {

                        console.log(res.data);

                        if (res.data.code != 10000) {
                            this.$toasted.clear();
                            this.$toasted.show(res.data.msg);
                            return;
                        }

                        this.$set(this.dealerInfo, 'todayLeadsState', true);

                        let extra = this.creatExtra(1);
                        this.Chat.sendMessage(this.targetId, '留资成功', extra).then((res) => {

                            res.content.extra = JSON.parse(res.content.extra);
                            this.list.push(res);
                            this.list = this.modifyMessage(this.list, this.targetId);
                            this.showRegister = flag;
                        }, (err) => {
                            this.$toasted.show(err.error);
                        });
                        this.scrollToBottom();

                    }).catch(err => {
                        this.$toasted.show(err);
                    });
                } else {
                    this.showRegister = flag;
                }


            },
            toggetRecall (flag) {
                this.showRecall = flag;
            },
            uploadFile (e) {
                console.log(e.target.files[0]);
                let _this = this;
                let file = e.target.files[0];
                let api = config.WAPI + 'img/upload';

                let quality = file.size > 1024*1024 ? ((1024*1024)/file.size).toFixed(2) : 1;


                lrz(file, {quality : parseFloat(quality)})
                .then(function (rst) {
                    // 把处理的好的图片给用户看看呗

                    console.log(rst);

                    rst.formData.append('fileLen', rst.fileLen);
                    rst.formData.append('action', 'updatePhone');
                    axios.post(api, rst.formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        console.log('update--success', res.data.data);

                        if (res.data.code != 10000) {
                            _this.$toasted.clear();
                            _this.$toasted.show(res.data.msg);
                            return;
                        }

                        _this.sendImgMsg(res.data.data, rst.base64.substring(0, 20));
                    }).catch(err => {
                        _this.$toasted.show(err.message);
                        console.log('update--fall', err);
                    });
                })
                .catch(function (err) {
                    // 万一出错了，这里可以捕捉到错误信息
                    // 而且以上的then都不会执行
                    _this.$toasted.show(err);
                }).always(() => {
                    // 不管是成功失败，这里都会执行

                    _this.$refs.phoneForm && _this.$refs.phoneForm.reset();
                });
            },
            toggetFancyBox (flag) {
                this.showFancyBox = flag;
            },
            fancyBox(e, url){
                // e=> $event, url=> 图片url 预览大图
                this.toggetFancyBox(true);
                this.fancyImgUrl = url;
                let radio = e.currentTarget.width / e.currentTarget.height;
                if (radio > document.body.clientWidth / document.body.clientHeight) {
                    this.fancyImg = {
                        w: '100%',
                        h: 'auto',
                        mt: (document.body.clientHeight - document.body.clientWidth / radio) / 2 + 'px',
                        ml: '0px'
                    }
                } else {
                    this.fancyImg = {
                        w: 'auto',
                        h: '100%',
                        mt: '0px',
                        ml: (document.body.clientWidth - document.body.clientHeight * radio) / 2 + 'px'
                    }
                }
            }
        },
        components: {emoji, register, recall},
        beforeCreate () {
        },
        created() {

            //经销商ID做为聊天目标ID
            this.targetId = this.$route.params.dealerId;
            //更新监听消息处理函数
            this.Chat.updateMessageListener((message) => {

                if ((typeof message.content.extra).toLowerCase() == 'string') {
                    message.content.extra = JSON.parse(message.content.extra);
                }
                console.log('接收到消息', message)

                switch (message.messageType) {
                    case RongIMClient.MessageType.TextMessage:

                        if (message.content.extra.txtMsgType == 5) {
                            console.log(message.content.extra)
                            this.$set(this.dealerInfo, 'id', message.content.extra.counselor.id);
                            this.$set(this.dealerInfo, 'name', message.content.extra.counselor.name);
                            this.$set(this.dealerInfo, 'headImg', message.content.extra.counselor.headImg);
                        }
                        this.list = this.list.concat(message);
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // message.content.content => 图片缩略图 base64。
                        // message.content.imageUri => 原图 URL。
                        this.list = this.list.concat(message);
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // message.content.content => 文本消息内容。
                        // message.content.imageUri => 图片 base64。
                        // message.content.url => 原图 URL。
                        this.list = this.list.concat(message);
                        break;
                    default:
                }
                this.scrollToBottom();
            });

            if (!!this.$route.query.recall) {
                //召回处理
                //link： messages/05009F5D-A10D-4106-9176-9FDE675A2A38?recall=12121212?userId=sdfsdfsdfsdf&recall=18299292
                this.recallMobile = this.$route.query.recall;
                this.showRecall = true;
            }
            this.getMessages();

        },
        mounted() {
        },
        destroyed(){
            this.Chat.clearCount(this.targetId);
        }
    };
</script>