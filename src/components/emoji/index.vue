<template>
    <div class="emojiBox" ref="emojiPh">

    </div>
</template>

<script>
    import './style.less';

    export default {
        props: {
            current: String
        },
        data () {
            return {
                emojiHtml: ''
            }
        },
        methods: {
            getEmojiDetailList()
            {
                RongIMLib.RongIMEmoji.init({
                    size: 28
                });
                let list = RongIMLib.RongIMEmoji.list;
                let shadowDomList = [];
                for (let i = 0; i < list.length; i++) {
                    shadowDomList.push(list[i].node);
                }

                this.bindClickEmoji(shadowDomList);

            },
            bindClickEmoji(emojis) {

                for (let i = 0; i < emojis.length; i++) {
                    let emojiHtml = emojis[i];
                    this.$refs.emojiPh.appendChild(emojiHtml);
                    emojiHtml.onclick = this.clickEmoji;
                }
            },
            clickEmoji(event) {
                let e = event || window.event;
                let target = e.target || e.srcElement;

                this.$emit('pickEmoji', target);
            }
        },
        mounted () {
            this.getEmojiDetailList();
        }
    }
    ;
</script>