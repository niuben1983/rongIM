'use strict';

import { cookie } from './utilMethods';

export default {
    install(Vue, options) {
        Vue.prototype.getBaiduLocation = () => {
            return new Promise((resolve, reject) => {

                let geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (result) {

                    if (this.getStatus() !== BMAP_STATUS_SUCCESS) {
                        console.log('GPS定位', result)
                        resolve({
                            lng: result.longitude,
                            lat: result.latitude,
                            name: result.address.city.replace(/市$/, '')
                        });
                    }
                    else {
                        let myCity = new BMap.LocalCity();
                        myCity.get((result) => {
                            console.log('ip定位', result)

                            resolve({
                                lng: result.center.lng,
                                lat: result.center.lat,
                                name: result.name.replace(/市$/, '')
                            })
                        });
                    }
                });
            });
        };
        Vue.prototype.HOST = CONFIG;
        //聊天时间显示格式化
        Vue.prototype.modifyMessage = (list, targetId) => {
            var otherInterval = 3 * 60 * 1000;
            var myInterval = 5 * 60 * 1000;
            var myAccountId = targetId;
            var oldSentTime;
            list.forEach(function (item, index) {
                //if (item.content.user) {
                //    item.user = item.content.user;
                //} else if (item.senderUserId) {
                //    item.user = getUser(item.senderUserId);
                //} else {
                //    item.user = getUser(targetId);
                //}
//                    item.time = getTime(item.sentTime);
//                    item.messageUId = 'RC' + item.messageUId;
                if (index === 0) {
                    oldSentTime = item.sentTime;
                    item._showTime = true;
                    return;
                }
                var interval = item.senderUserId === myAccountId ? myInterval : otherInterval;
                var sentTime = item.sentTime || (new Date).getTime();
                if (sentTime - oldSentTime > interval) {
                    oldSentTime = item.sentTime;
                    item._showTime = true;
                } else {
                    item._showTime = false;
                }
            });
            return list;
        };
    }
}