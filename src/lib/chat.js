import { cookie, randomWord, isWX, getUrlParam } from './utilMethods';
import axios from "axios";
const config = CONFIG;

export default {
    install(Vue, options) {
        Vue.prototype.Chat = {
            appId: config.APPID,
            hasConnect: false,
            userInfo: '',
            updateMessageListener: function (fn) {
                this.messageListenerCallback = fn;
            },
            messageListenerCallback: function (data) {
            },
            getToken: function (userId) {

                let _this = this;
                return new Promise((resolve, reject) => {
                    //微信认证
                    //if (isWX()) {
                    //    if (!!_this.userInfo) {
                    //        resolve(_this.userInfo);
                    //        return;
                    //    }
                    //    let url = decodeURIComponent(location.href);
                    //    let wxapi = config.WAPI + 'api/weixin/user/info';
                    //
                    //
                    //    if (!/openid/.test(url)) {
                    //        window.location.href = wxapi + '?callback_url=' + encodeURIComponent(url);
                    //        return;
                    //    }
                    //    let api = config.WAPI + 'auth/user/gettoken';
                    //    let openid = getUrlParam('openid', url);
                    //    let nickname = getUrlParam('nickname', url);
                    //    let headimgurl = getUrlParam('headimgurl', url);
                    //
                    //    axios.get(api, {
                    //        params: {
                    //            deviceId: openid,
                    //            userPic: headimgurl,
                    //            userName: nickname,
                    //            clientType: 1
                    //        }
                    //    }).then(res => {
                    //        if (res.data.code != 10000) {
                    //            Vue.toasted.show(res.data.msg);
                    //            return;
                    //        }
                    //        ;
                    //
                    //        _this.userInfo = res.data.data;
                    //        resolve(res.data.data);
                    //    }).catch(err => {
                    //        Vue.toasted.show(err);
                    //    });
                    //
                    //} else
                    if (!userId) {
                        //没有userid
                        if (cookie('deviceId') && _this.userInfo) {
                            resolve(_this.userInfo);
                            return;
                        }

                        let deviceId = cookie('deviceId') || randomWord(false, 32);
                        let api = config.WAPI + 'auth/user/gettoken';

                        axios.get(api, {
                            params: {
                                deviceId: deviceId,
                                clientType: 1
                            }
                        }).then(res => {

                            if (res.data.code != 10000) {
                                // Vue.toasted.show(res.data.msg)
                                Vue.toasted.show('当前无法获取服务，请稍后再试')
                                return;
                            }
                            ;
                            console.log('获取token', res)

                            cookie('deviceId', deviceId);
                            _this.userInfo = res.data.data;

                            resolve(res.data.data);
                        }).catch(err => {
                            Vue.toasted.show('当前无法获取服务，请稍后再试')
                        });
                    } else {
                        let api = config.WAPI + 'auth/user/getuserinfo';
                        axios.get(api, {
                            params: {
                                userId: userId
                            }
                        }).then(res => {
                            if (res.code != 10000) return;
                            console.log('id获取token', res)

                            _this.userInfo = res.data.data;
                            cookie('deviceId', res.data.deviceId);
                            resolve(res.data.data);
                        }).catch(err => {
                            Vue.toasted.show('当前无法获取服务，请稍后再试')
                        });
                    }
                });
            },
            updateToken: function (userId) {

                let _this = this;
                return new Promise((resolve, reject) => {

                        let api = config.WAPI + 'auth/user/refreshuserToken';

                        axios.get(api, {
                            params: {
                                userId: _this.userInfo.id
                            }
                        }).then(res => {

                            if (res.data.code != 10000) {
                                // Vue.toasted.show(res.data.msg)
                                Vue.toasted.show('当前无法获取服务，请稍后再试')
                                return;
                            }
                            ;
                            console.log('获取token11', res)

                            _this.userInfo = res.data.data;

                            console.log('userInfo', res)

                            resolve(res.data.data);
                        }).catch(err => {
                            Vue.toasted.show('当前无法获取服务，请稍后再试')
                        });
                });
            },
            client: (appId) => {
                //初始化SDK
                RongIMLib.RongIMClient.init(appId);
            },
            setOnReceiveMessageListener: function () {
                let _this = this;
                // 设置连接监听状态 （ status 标识当前连接状态 ）
                // 连接状态监听器
                RongIMLib.RongIMClient.setConnectionStatusListener({
                    onChanged: function (status) {
                        switch (status) {
                            case RongIMLib.ConnectionStatus.CONNECTED:
                                console.log('链接成功');
                                _this.hasConnect = true;
                                break;
                            case RongIMLib.ConnectionStatus.CONNECTING:
                                console.log('正在链接');
                                _this.hasConnect = false;
                                break;
                            case RongIMLib.ConnectionStatus.DISCONNECTED:
                                console.log('断开连接');
                                //Vue.toasted.show('断开连接');
                                _this.hasConnect = false;
                                break;
                            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                                console.log('其他设备登录');
                                //Vue.toasted.show('其他设备登录')
                                _this.hasConnect = false;
                                ;
                                break;
                            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                                console.log('域名不正确');
                                _this.hasConnect = false;
                                break;
                            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                                console.log('网络不可用');
                                //Vue.toasted.show('网络不可用');
                                _this.hasConnect = false;
                                break;
                        }
                    }
                });
                // 消息监听器
                RongIMClient.setOnReceiveMessageListener({
                    // 接收到的消息
                    onReceived: function (message) {
                        // 判断消息类型
                        _this.messageListenerCallback(message);
                    }
                });
            },
            connect: function (token, targetId, timestrap) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    if (_this.hasConnect) {
                        if (targetId) {
                            _this.getHistoryMessagesPromise = _this.getHistoryMessages(targetId, timestrap);
                        }
                        _this.getConversationListPromise = _this.getConversationList();
                        resolve({msg: '已连接服务器'});
                    } else {
                        RongIMClient.connect(token, {
                            onSuccess: function (userId) {
                                console.log("Connect successfully." + userId);
                                resolve({userId: userId});

                                _this.hasConnect = true;
                                if (targetId) {
                                    _this.getHistoryMessagesPromise = _this.getHistoryMessages(targetId, timestrap);
                                }
                                _this.getConversationListPromise = _this.getConversationList();
                                ////拉取会话列表
                                //aodiChat.getConversationList();
                            },
                            onTokenIncorrect: function () {
                                console.log('connect111', 'token无效');

                                _this.updateToken(_this.userInfo.id).then(res => {
                                    console.log('token', res.rongToken)
                                    _this.connect(res.rongToken);
                                });

                                // reject({error: 'token无效'})
                            },
                            onError: function (errorCode) {
                                var info = '';
                                _this.hasConnect = false;
                                _this.reconnect(targetId, timestrap).then(res=>{});
                                switch (errorCode) {
                                    case RongIMLib.ErrorCode.TIMEOUT:
                                        info = '连接超时';
                                        break;
                                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                        info = '未知错误';
                                        break;
                                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                                        info = '不可接受的协议版本';
                                        break;
                                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                                        info = 'appkey不正确';
                                        break;
                                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                                        info = '服务器不可用';
                                        break;
                                }
                                console.log('connect', errorCode);
                                reject({error: info})
                            }
                        });

                    }
                });
            },
            reconnect: function (targetId, timestrap) {

                let _this = this;
                return new Promise((resolve, reject) => {
                    if (_this.hasConnect) {
                        resolve({msg: '已连接服务器'});
                        return;
                    }

                    RongIMClient.reconnect({
                        onSuccess: function (userId) {
                            console.log("Reconnect successfully." + userId);
                            Vue.toasted.show('重新连接成功')

                            _this.hasConnect = true;

                            if (targetId) {
                                _this.getHistoryMessagesPromise = _this.getHistoryMessages(targetId, timestrap);
                            }
                            _this.getConversationListPromise = _this.getConversationList();
                            ////拉取会话列表
                            //aodiChat.getConversationList();
                            resolve({userId: userId});
                        },
                        onTokenIncorrect: function () {
                            console.log('reconnect', 'token无效');
                            reject({error: 'token无效'})
                        },
                        onError: function (errorCode) {
                            var info = '';
                            _this.hasConnect = false;
                            switch (errorCode) {
                                case RongIMLib.ErrorCode.TIMEOUT:
                                    info = '连接超时';
                                    break;
                                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                    info = '未知错误';
                                    break;
                                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                                    info = '不可接受的协议版本';
                                    break;
                                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                                    info = 'appkey不正确';
                                    break;
                                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                                    info = '服务器不可用';
                                    break;
                            }
                            _this.hasConnect = false;
                            console.log('reconnect', errorCode);
                            reject({error: info})
                        }
                    }, {
                        // 默认 false, true 启用自动重连，启用则为必选参数
                        auto: true,
                        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                        rate: [100, 1000, 3000, 6000, 10000]
                    });
                });
            },
            sendMessage: function (targetId, text, extra) {
                let conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
                let msgContent = {
                    content: text, extra: JSON.stringify(extra)
                }

                let msg = new RongIMLib.TextMessage(msgContent);

                return new Promise((resolve, reject) => {
                    RongIMLib.RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                            onSuccess: function (message) {
                                //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                                console.log("Send successfully", message);
                                resolve(message);
                            },
                            onError: function (errorCode, message) {
                                var info = '';
                                switch (errorCode) {
                                    case RongIMLib.ErrorCode.TIMEOUT:
                                        info = '超时';
                                        break;
                                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                        info = '未知错误';
                                        break;
                                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                        info = '在黑名单中，无法向对方发送消息';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                        info = '不在讨论组中';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                        info = '不在群组中';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                        info = '不在聊天室中';
                                        break;
                                    default :
                                        info = x;
                                        break;
                                }
                                console.log('发送失败:' + info);
                                reject({error: info, message: message});
                            }
                        }
                    );
                });
            },
            sendImgMessage: function (targetId, base64Str, imageUri, extra) {
                let conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
                let msgContent = {
                    content: base64Str, imageUri: imageUri, extra: JSON.stringify(extra)
                }
                let msg = new RongIMLib.ImageMessage(msgContent);

                return new Promise((resolve, reject) => {
                    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                            onSuccess: function (message) {
                                //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                                console.log("Send successfully");
                                resolve(message);
                            },
                            onError: function (errorCode, message) {
                                var info = '';
                                switch (errorCode) {
                                    case RongIMLib.ErrorCode.TIMEOUT:
                                        info = '超时';
                                        break;
                                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                        info = '未知错误';
                                        break;
                                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                        info = '在黑名单中，无法向对方发送消息';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                        info = '不在讨论组中';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                        info = '不在群组中';
                                        break;
                                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                        info = '不在聊天室中';
                                        break;
                                    default :
                                        info = x;
                                        break;
                                }
                                console.log('发送失败:' + info);
                                reject({error: info});
                            }
                        }
                    );
                });
            },
            getHistoryMessagesPromise: null,
            getHistoryMessages: function (targetId, timestrap) {

                if (typeof timestrap == 'number') {
                    timestrap = 0;
                } else {
                    timestrap = null;
                }

                return function () {
                    return new Promise((resolve, reject) => {
                        //请确保单群聊消息云存储服务开通，且开通后有过收发消息记录
                        RongIMLib.RongIMClient.getInstance().getHistoryMessages(RongIMLib.ConversationType.PRIVATE, targetId, timestrap, 20, {
                            onSuccess: function (list, hasMsg) {
                                // hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
                                // list 为拉取到的历史消息列表


                                console.log('历史消息：', list);

                                list.forEach(o => {
                                    if ((typeof o.content.extra).toLowerCase() == 'string') {
                                        o.content.extra = JSON.parse(o.content.extra);
                                    }
                                })
                                //过滤，变更客服的消息
                                //let newlist = list.filter(o => {
                                //    return o.content.messageName != 'TextMessage' || o.content.extra.txtMsgType != 5;
                                //});

                                resolve({data: list, hasMsg: hasMsg});
                            },
                            onError: function (error) {
                                // APP未开启消息漫游或处理异常
                                // throw new ERROR ......
                                console.log('error', error)
                                reject({'error': error})
                            }
                        });
                    });
                }
            },
            getConversationListPromise: null,
            getConversationList: function () {
                let _this = this;
                return function () {
                    return new Promise((resolve, reject) => {
                        RongIMLib.RongIMClient.getInstance().getConversationList({
                            onSuccess: function (list) {
                                console.log('获取会话列表qian ', list);
                                //处理客服变更的消息
                                list.forEach(o => {
                                    if ((typeof o.latestMessage.content.extra).toLowerCase() == 'string') {
                                        o.latestMessage.content.extra = JSON.parse(o.latestMessage.content.extra);
                                    }
                                    if(o.latestMessage.content.extra.txtMsgType == 5){
                                        o.latestMessage.content.content = '客服已变更';
                                    }
                                })

                                resolve(list);
                                console.log('获取会话列表', list);
                            },
                            onError: function (error) {
                                reject({error: error});
                            }
                        }, null);
                    });
                }
            },
            getCount: function () {
                return new Promise((resolve, reject) => {
                    RongIMLib.RongIMClient.getInstance().getTotalUnreadCount({
                        onSuccess: function (count) {
                            // count => 所有会话总未读数。
                            resolve(count);
                        },
                        onError: function (error) {
                            // error => 获取总未读数错误码。
                        }
                    });
                })
            },
            clearCount: function (targetId) {
                let conversationType = RongIMLib.ConversationType.PRIVATE;
                RongIMLib.RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                    onSuccess: function () {
                        // 清除未读消息成功。
                        console.log('清除未读消息成功')
                    },
                    onError: function (error) {
                        // error => 清除未读消息数错误码。
                        console.log('清除未读消息数错误码', error)
                    }
                });
            }

        };


    }
}