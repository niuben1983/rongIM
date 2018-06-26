<template src="./template.html"></template>

<script type="text/ecmascript-6">
    'use strict';
    import './style.less';

    export default {
        data() {
            return {
            };
        },
        computed: {},
        methods: {
            initMap () {
                let log = parseFloat(this.$route.query.log || 116.404);
                let lat = parseFloat(this.$route.query.lat || 39.915)
//                let log = parseFloat(116.526);
//                let lat = parseFloat(40.2172);
                let point = new BMap.Point(log, lat);
                let map = new BMap.Map("map");
                map.centerAndZoom(point, 15);

                let marker = new BMap.Marker(point);        // 创建标注
                map.addOverlay(marker);

                var myGeo = new BMap.Geocoder();
                myGeo.getLocation(point, (result) => {
                    if (result){
                        let html = `<div class="mapTips">
                        <p class="mapTips_main oneline">我在 <strong>${result.address}</strong> 附近</p>
                        <!--<span class="mapTips_arrow"></span>-->
                    </div>`;
                        let infoBox = new BMapLib.InfoBox(map, html,{
                            closeIconMargin: "10000000px 1px 0 0",
                            enableAutoPan: true,
                            align: INFOBOX_AT_TOP
                        });

                        infoBox.open(marker);  //创建窗口
                        marker.enableDragging();
                    }
                });







//                var opts = {
//                    width : 250,     // 信息窗口宽度
//                    height: 100,     // 信息窗口高度
//                    title : "Hello"  // 信息窗口标题
//                }
//                var infoWindow = new BMap.InfoWindow("World", opts);  // 创建信息窗口对象
//                map.openInfoWindow(infoWindow, map.getCenter());
            }
        },
        components: {},
        created() {


        },
        mounted() {
            this.initMap();
        }
    };
</script>