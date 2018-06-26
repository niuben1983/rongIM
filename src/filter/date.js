'use strict';
import Vue from 'vue';

Vue.filter('formatDate', function (value) {
    if (!value) return ''

    let oldtime = new Date(value);
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime();
    let beforeYestday = new Date(today - 24 * 3600 * 1000 * 2).getTime();
    let beforeWeek = new Date(today - 24 * 3600 * 1000 * 7).getTime();
    let Y = oldtime.getFullYear(); //年份
    let M = zeroFill(oldtime.getMonth() + 1); //月份
    let d = zeroFill(oldtime.getDate()); //日
    let h = zeroFill(oldtime.getHours() % 12 == 0 ? 12 : oldtime.getHours() % 12); //12小时
    let H = zeroFill(oldtime.getHours()); //24小时
    let m = zeroFill(oldtime.getMinutes()); //分
    let w = toWeek(oldtime.getUTCDay()); //星期
    let timesolt = toTimeSolt(oldtime.getHours()); //时间段

    let timeStr = '';

    //当天
    if (oldtime.getTime() > yestday) {
        timeStr = H + ':' + m;
    }
    //昨天
    if (oldtime.getTime() < today && yestday <= oldtime.getTime()) {
        timeStr = '昨天 ' + H + ':' + m;
    }
    // 一周内
    if (oldtime.getTime() < yestday && beforeWeek <= oldtime.getTime()) {
        timeStr = w + ' ' + H + ':' + m;
    }
    // 一周前
    if (oldtime.getTime() < beforeWeek) {
        timeStr = Y + '/' + M + '/' + d + ' ' + H + ':' + m;
    }
    //刚刚 <5分钟
    if (oldtime.getTime() + 5*60*1000 > date) {
        timeStr = '刚刚';
    }
    // 比当前时间晚
    if (oldtime.getTime() > date.getTime()) {
        timeStr = '刚刚';
    }


    return timeStr;


});

Vue.filter('formatDateList', function (value) {
    if (!value) return ''

    let oldtime = new Date(value);
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime();
    let beforeYestday = new Date(today - 24 * 3600 * 1000 * 2).getTime();
    let beforeWeek = new Date(today - 24 * 3600 * 1000 * 7).getTime();
    let Y = oldtime.getFullYear(); //年份
    let M = zeroFill(oldtime.getMonth() + 1); //月份
    let d = zeroFill(oldtime.getDate()); //日
    let h = zeroFill(oldtime.getHours() % 12 == 0 ? 12 : oldtime.getHours() % 12); //12小时
    let H = zeroFill(oldtime.getHours()); //24小时
    let m = zeroFill(oldtime.getMinutes()); //分
    let w = toWeek(oldtime.getUTCDay()); //星期
    let timesolt = toTimeSolt(oldtime.getHours()); //时间段

    let timeStr = '';

    //当天
    if (oldtime.getTime() > yestday) {
        timeStr = H + ':' + m;
    }
    //昨天
    if (oldtime.getTime() < today && yestday <= oldtime.getTime()) {
        timeStr = '昨天';
    }
    // 一周内
    if (oldtime.getTime() < yestday && beforeWeek <= oldtime.getTime()) {
        timeStr = w;
    }
    // 一周前
    if (oldtime.getTime() < beforeWeek) {
        timeStr = Y + '.' + M + '.' + d;
    }
    //刚刚 <5分钟
    if (oldtime.getTime() + 5*60*1000 > date) {
        timeStr = '刚刚';
    }
    // 比当前时间晚
    if (oldtime.getTime() > date.getTime()) {
        timeStr = '刚刚';
    }


    return timeStr;


});

// 日期补零
function zeroFill (date) {
    return date > 9 ? date : '0'+date;
}

// 格式化时间段
function toTimeSolt(h) {
    let bt = '';
    if (0 <= h && h <= 3)
        bt = '凌晨';
    if (4 <= h && h <= 8)
        bt = '早上';
    if (9 <= h && h <= 11)
        bt = '上午';
    if (12 == h)
        bt = '中午';
    if (13 <= h && h <= 17)
        bt = '下午';
    if (18 <= h && h <= 23)
        bt = '晚上';

    return bt;
}

// 格式星期
function toWeek(w) {
    let week = '';
    switch (w) {
        case 0:
            week = '周日';
            break;
        case 1:
            week = '周一';
            break;
        case 2:
            week = '周二';
            break;
        case 3:
            week = '周三';
            break;
        case 4:
            week = '周四';
            break;
        case 5:
            week = '周五';
            break;
        case 6:
            week = '周六';
            break;
    }
    return week;
}