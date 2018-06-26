<template>
    <div class="navbar">
        <router-link to="dealers" :class="{ active: current == 'dealers' }">
            经销商
        </router-link>
        <router-link to="messages" :class="{ active: current == 'messages' }">
            消息 <span v-show="getCount > 0">{{ getCount }}</span>
        </router-link>
    </div>
</template>

<script>
    import './style.less';

    export default {
        props: {
            current: String,
            count: Number
        },
        computed : {
            getCount () {

                return this.count > 99 ? 99 : this.count;;
            }
        }
    };
</script>