<template>
    <div class="pg_map">
        <el-radio-group v-model="mapType">
            <el-radio-button label="">清空</el-radio-button>
            <el-radio-button :label="BMAP">百度</el-radio-button>
            <el-radio-button :label="AMAP">高德</el-radio-button>
        </el-radio-group>
        <div class="map">
            <BaseMap :type="mapType" @onMapComplete="onMapComplete"></BaseMap>
        </div>
    </div>
</template>
<script>
import Iovgis from 'gis/iov-gis'
import Const from 'utils/const/const'
import BaseMap from '@/components/map/base-map'

export default {
    name: 'Map',
    components: {
        BaseMap
    },
    data() {
        return {
            ...Const.MAP_TYPE,
            mapType: '',
            map: null,
        };
    },
    mounted() {

    },
    methods: {
        onMapComplete(map) {
            this.map = map;
        }
    }
};
</script>
<style scoped lang="less">
.pg_map {
    width: 100%;
    .map {
        height: 80vh;
    }
}
</style>
