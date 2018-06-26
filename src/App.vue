<template>
    <div class="wapper">
        <router-view></router-view>
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
    'use strict';
    import './css/base.less';
    import './components/emoji/style.less';
    import './components/loadfailed/style.less';
    import './components/navbar/style.less';
    import './components/recall/style.less';
    import './components/register/style.less';
    import './components/selectCar/style.less';
    import './components/selectCity/style.less';
    export default {
        name: 'app',
        created() {
            this.Chat.client(this.Chat.appId);
//
//
//
            this.Chat.setOnReceiveMessageListener();



//            getToken().then((res) => {
//                this.Chat.connect(res.rongToken);
//            });

        }
    }
</script>

