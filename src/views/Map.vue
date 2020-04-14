<template>
    <div class="pg_map">
        <el-radio-group v-model="mapType" @change="onTypeChange">
            <el-radio-button :label="0">清空</el-radio-button>
            <el-radio-button :label="BMAP">百度</el-radio-button>
            <el-radio-button :label="AMAP">高德</el-radio-button>
        </el-radio-group>
        <div v-if="mapType === BMAP" id="bmap_container" class="map-container" :key="1"></div> 
        <div v-else-if="mapType === AMAP" id="amap_container" class="map-container" :key="2"></div> 
    </div>
</template>
<script>
import Iovgis from 'gis/iov-gis'
import {gcjToBd} from 'gis/utils/coordsTransform'
import Const from 'utils/const/const'

export default {
    name: 'Map',
    components: {
    },
    data() {
        return {
            ...Const.MAP_TYPE,
            mapList: {
                [Const.MAP_TYPE.BMAP]: {
                    ak: process.env.VUE_APP_BAIDU_AK,
                    container: 'bmap_container',
                    center: gcjToBd([116.397428, 39.90923])
                },
                [Const.MAP_TYPE.AMAP]: {
                    ak: process.env.VUE_APP_GAODE_AK,
                    container: 'amap_container',
                    center: [116.397428, 39.90923]
                }
            },
            mapType: 0,
            map: null,
        };
    },
    mounted() {

    },
    methods: {
        onTypeChange(type) {
            // 销毁地图
            if(this.map){
                this.map.destroy();
                this.map = null;
            }
            
            if(this.mapList[type]) this.initMap(type, this.mapList[type].ak);
        },

        initMap(type, ak) {
            this.map = new Iovgis({
                container: this.mapList[type].container,
                center: this.mapList[type].center,
                type,
                ak
            });
        }
    },
    beforeDestroy() {
    }
};
</script>
<style scoped lang="less">
.pg_map {
    width: 100%;
    .map-container {
        min-height: 80vh;
    }
}
</style>
