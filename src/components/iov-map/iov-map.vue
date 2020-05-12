<style lang="less">
.co-iov-map {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    &__map-container {
        width: 100%;
        height: 100%;
    }
    &__zoom-control {
        position: absolute;
        bottom: 60px;
        right: 12px;
    }
    &__select-bar {
        position: absolute;
        bottom: 16px;
        right: 12px;
    }
    &__tool-bar {
        position: absolute;
        right: 12px;
        bottom: 140px;
    }
}
</style>

<template>
    <div class="co-iov-map" v-click-outside="closeMapTool">
        <div v-if="mapType === BMAP" id="bmap_container" class="co-iov-map__map-container" :key="1"></div>
        <div v-else-if="mapType === AMAP" id="amap_container" class="co-iov-map__map-container" :key="2"></div>
        <template v-if="map">
            <MapZoomControl
                v-if="!hideZoomControl"
                class="co-iov-map__zoom-control"
                :map="map"
            ></MapZoomControl>
            <MapSelectBar
                v-if="!hideSelectBar && !isToolFocus"
                class="co-iov-map__select-bar"
                :hasTimeRefresh="hasTimeRefresh"
                :map="map"
                :type.sync="mapType"
                @onMapTypeChange="onMapTypeChange"
                @onRefreshTimeChange="onRefreshTimeChange"
            ></MapSelectBar>
            <MapTool
                ref="MapTool"
                v-if="!hideToolBar && map.gisMap"
                class="co-iov-map__tool-bar"
                :map="map"
                @onToolSelect="onToolSelect"
            ></MapTool>
        </template>
    </div>
</template>
<script>
import Iovgis from '@/utils/iov-gis/iov-gis';
import Const from '@/utils/iov-gis/const/const.js';
import MapSelectBar from './common/map-select-bar';
import MapZoomControl from './common/map-zoom-control';
import MapTool from './common/map-tool';

export default {
    name: 'IovMap',
    components: {
        MapSelectBar,
        MapZoomControl,
        MapTool
    },
    props: {
        type: {
            type: String,
            default: Const.MAP_TYPE.BMAP
        },
        hideZoomControl: Boolean,
        hideSelectBar: Boolean,
        hideToolBar: Boolean,
        hasTimeRefresh: Boolean
    },
    data() {
        const baiduAk = process.env.VUE_APP_BAIDU_AK;
        return {
            ...Const.MAP_TYPE,
            mapType: this.type,
            mapList: {
                [Const.MAP_TYPE.BMAP]: {
                    ak: baiduAk,
                    container: 'bmap_container',
                    center: [115.29, 35.33]
                },
                [Const.MAP_TYPE.AMAP]: {
                    ak: 'e4b1185b4262abca04e141c79d99dda8',
                    container: 'amap_container',
                    center: [115.28345, 35.32411]
                }
            },
            map: null,
            isToolFocus: false
        };
    },
    computed: {
        currentMapInfo() {
            return this.mapList[this.mapType];
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        /**
         * 初始化地图
         */
        initMap() {
            if (!this.currentMapInfo) return;

            let {
                currentMapInfo,
                mapType,
                onComplete
            } = this;

            this.map = new Iovgis({
                container: currentMapInfo.container,
                center: currentMapInfo.center,
                ak: currentMapInfo.ak,
                type: mapType,
                onComplete
            });
        },

        /**
         * 地图实例初始化完成
         */
        onComplete() {
            this.$emit('onMapComplete', this.map);
        },

        /**
         * 地图类型切换
         */
        onMapTypeChange(type) {
            this.refreshMap();
            this.$emit('onMapTypeChange', type);
        },

        /**
         * 刷新时间切换
         */
        onRefreshTimeChange(time) {
            this.$emit('onRefreshTimeChange', time);
        },

        /**
         * 地图刷新
         */
        refreshMap(flag = true) {
            // 先销毁地图
            if (this.map) {
                this.map.destroy();
                this.map = null;
            }

            if (flag) {
                this.initMap();
            }
        },

        /**
         * 地图工具栏选中事件
         */
        onToolSelect(val) {
            this.isToolFocus = val;
            this.$emit('onMapToolClick', val);
        },

        /**
         * 点击地图以外的区域需关闭工具栏
         */
        closeMapTool () {
            if (this.isToolFocus) {
                this.$refs.MapTool.refCloseTool();
            }
        }
    },
    beforeDestroy() {
        this.refreshMap(false);
    }
};
</script>
