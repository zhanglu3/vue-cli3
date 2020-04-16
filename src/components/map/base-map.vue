<template>
    <div class="co_base_map">
        <div v-if="type === BMAP" id="bmap_container" class="map-container" :key="1"></div> 
        <div v-else-if="type === AMAP" id="amap_container" class="map-container" :key="2"></div>
        <template v-if="map">
            <div v-if="!hideZoomControl" class="zoom-control">
                <div class="zoom-control-btn" @click="onZoom(1)"><i class="el-icon-plus"></i></div>
                <div class="zoom-control-btn divided" @click="onZoom(-1)"><i class="el-icon-minus"></i></div>
            </div>
            <div v-if="!hideToolBar" class="tool-bar">
                <div class="layer-select">
                    <el-dropdown trigger="click" placement="bottom">
                        <span class="layer-select-link">
                            地图图层<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <ul class="layer-select-dropdown">
                                <el-checkbox-group v-model="layerCheckList">
                                    <li v-for="(item, index) in mapLayerList" :key="index">
                                        <el-checkbox :label="item.value" @change="onLayerChange(item)">{{item.name}}</el-checkbox>
                                    </li>
                                </el-checkbox-group>
                            </ul>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import Iovgis from 'gis/iov-gis'
import Const from 'utils/const/const'

export default {
    name: 'BaseMap',
    props: {
        type: {
            type: String,
            default: Const.MAP_TYPE.BMAP
        },
        hideZoomControl: Boolean,
        hideToolBar: Boolean
    },
    data() {
        return {
            ...Const.MAP_TYPE,
            mapList: {
                [Const.MAP_TYPE.BMAP]: {
                    ak: process.env.VUE_APP_BAIDU_AK,
                    container: 'bmap_container',
                    center: [116.404, 39.915]
                },
                [Const.MAP_TYPE.AMAP]: {
                    ak: process.env.VUE_APP_GAODE_AK,
                    container: 'amap_container',
                    center: [116.397428, 39.90923]
                }
            },
            mapLayerList: [
                {name: '路况图层', value: Const.LAYER_TYPE.TRAFFIC},
                {name: '卫星图层', value: Const.LAYER_TYPE.SATELLITE},
                {name: '卫星路网', value: Const.LAYER_TYPE.ROADNET},
            ],
            layerCheckList: [],
            map: null,
        };
    },
    computed: {
        currentMapInfo(){
            return this.mapList[this.type];
        }
    },
    watch: {
        type() {
            this.layerCheckList = [];
            this.onTypeChange();
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            if(!this.currentMapInfo) return;

            let {
                currentMapInfo,
                type,
                onComplete
            } = this;

            this.map = new Iovgis({
                container: currentMapInfo.container,
                center: currentMapInfo.center,
                ak: currentMapInfo.ak,
                type,
                onComplete
            });
        },

        onComplete(gisMap) {
            this.$emit('onMapComplete', this.map);
        },

        onTypeChange(flag = true) {
            // 销毁地图
            if(this.map){
                this.map.destroy();
                this.map = null;
            }
            
            if(flag){
                this.initMap();
            }
        },

        onZoom(val) {
            const fun = val > 0 ? this.map.zoomIn() : this.map.zoomOut();
        },

        onLayerChange(item) {
            if(this.layerCheckList.includes(item.value)){
                // 新增图层
                // 卫星与卫星路网只能二选一
                const tmp = [Const.LAYER_TYPE.SATELLITE, Const.LAYER_TYPE.ROADNET];
                if(this.layerCheckList.includes(tmp[0]) && this.layerCheckList.includes(tmp[1])) {
                    let idx = this.layerCheckList.findIndex(function(value, index) {
                        return tmp.includes(value) && value !== item.value;
                    });
                    this.map.removeLayer(this.layerCheckList[idx].value, this.layerCheckList[idx].layer)
                    this.layerCheckList.splice(idx, 1);
                }
                item.layer = this.map.addLayer(item.value)
            } else {
                // 移除图层
                this.map.removeLayer(item.value, item.layer)
            }
        }
    },
    beforeDestroy() {
        this.onTypeChange(false);
    }
};
</script>
<style lang="less">
.co_base_map {
    width: 100%;
    height: 100%;
    position: relative;
    .map-container {
        width: 100%;
        height: 100%;
    }
    .zoom-control {
        position: absolute;
        bottom: 60px;
        right: 12px;
        background-color: #fff;
        border: 1px solid #d9dde4;
        border-radius: 2px;
        &-btn {
            width: 30px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            &:hover {
                color: #2d7dea;
                background-color: #ddecf7;
            }
        }
        .divided:before {
            content: "";
            display: block;
            margin: 0 5px;
            height: 1px;
            background-color: #bfbfbf;
        }
    }
    .tool-bar {
        position: absolute;
        top: 20px;
        right: 42px;
        background-color: #fff;
        border: 1px solid #d9dde4;
        border-radius: 2px;

        .layer-select {
            padding: 2px 6px;

            &-link {
                cursor: pointer;
                outline: none;
                font-size: 12px;
                &:hover {
                    color: #409EFF;
                }
            }
        }
    }
}

.el-dropdown-menu {
    padding: 10px;
}

.el-checkbox {
    font-weight: 400;
    &__label {
        font-size: 12px;;
    }
}
</style>
