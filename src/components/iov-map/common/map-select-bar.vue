<style lang="less">
.co-map-select-bar {
    border: 1px solid #d9dde4;
    border-radius: 4px;
    background-color: #fff;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .select-item {
        padding: 0 20px;
        position: relative;
        &-link {
            display: block;
            cursor: pointer;
            outline: none;
            font-size: 12px;
        }
        .down-icon {
            margin-left: 10px;
            transform: rotate(0deg);
            -webkit-transition: transform .15s linear;
            -moz-transition: transform .15s linear;
            -o-transition: transform .15s linear;
            transition: transform .15s linear;
            &--active {
                transform: rotate(180deg);
            }
        }
    }
    .divided::before {
        content: "";
        display: block;
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        width: 1px;
        background-color: #d9dde4;
    }
}
</style>
<template>
    <div class="co-map-select-bar">
        <div class="select-item">
            <el-dropdown placement="top" size="medium" @visible-change="onTypeVisible" @command="onTypeClick">
                <span class="select-item-link">
                    {{mapTypeComputed}}<i class="el-icon-caret-bottom down-icon" :class="{'down-icon--active': visible.type}"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="co-map-select-bar__dropdown">
                    <el-dropdown-item
                        v-for="(value, key) in mapTypeList"
                        :key="key"
                        :command="key"
                        :class="{'select-item-li--active': mapType === key}"
                    >{{value.name}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="select-item divided">
            <el-dropdown placement="top" @visible-change="onLayerVisible">
                <span class="select-item-link">
                    地图图层<i class="el-icon-caret-bottom down-icon" :class="{'down-icon--active': visible.layer}"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="co-map-select-bar__dropdown">
                    <ul class="layer-select-dropdown">
                        <el-checkbox-group v-model="layerCheckList">
                            <li v-for="(item) in mapLayerList" :key="item.value">
                                <el-checkbox :label="item.value" @change="onLayerChange(item)">{{item.name}}</el-checkbox>
                                <template v-if="item.child">
                                    <div v-for="(n, i) in item.child" :key="i" class="layer-select--child">
                                        <el-checkbox
                                            :label="n.value"
                                            :disabled="!layerCheckList.includes(n.parent)"
                                            @change="onLayerChange(n)"
                                        >{{n.name}}</el-checkbox>
                                    </div>
                                </template>
                            </li>
                        </el-checkbox-group>
                    </ul>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="select-item divided" v-if="hasTimeRefresh">
            <el-dropdown placement="top" size="medium" @visible-change="onTimeVisible" @command="onTimeClick">
                <span class="select-item-link">
                    每{{ refreshTime }}s刷新<i class="el-icon-caret-bottom down-icon" :class="{'down-icon--active': visible.time}"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="co-map-select-bar__dropdown">
                    <el-dropdown-item
                        v-for="(item, index) in refreshTimeList"
                        :key="index"
                        :command="item.value"
                        :class="{'select-item-li--active': refreshTime === item.value}"
                    >{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import Const from '@/utils/iov-gis/const/const.js';

export default {
    name: 'MapSelectBar',
    props: {
        hasTimeRefresh: Boolean,
        map: {
            type: Object,
            default: () => {}
        },
        type: { // 初始化地图类型
            type: String,
            default: Const.MAP_TYPE.BMAP
        }
    },
    data() {
        return {
            refreshTime: 10,
            mapType: this.type,
            mapTypeList: {
                [Const.MAP_TYPE.BMAP]: {
                    name: '百度地图'
                },
                [Const.MAP_TYPE.AMAP]: {
                    name: '高德地图'
                }
            },
            mapLayerList: [
                {name: '路况图层', value: Const.LAYER_TYPE.TRAFFIC},
                {
                    name: '卫星图层',
                    value: Const.LAYER_TYPE.SATELLITE,
                    child: [
                        {name: '路网图层', value: Const.LAYER_TYPE.ROADNET, parent: Const.LAYER_TYPE.SATELLITE}
                    ]
                }
            ],
            refreshTimeList: [
                {name: '每10秒刷新', value: 10},
                {name: '每20秒刷新', value: 20},
                {name: '每30秒刷新', value: 30}
            ],
            layerCheckList: [],
            visible: {
                type: false,
                layer: false,
                time: false
            }
        };
    },
    computed: {
        mapTypeComputed() {
            let data = this.mapTypeList[this.mapType];
            return data ? data.name : '';
        }
    },
    methods: {
        /**
         * 地图类型点击事件
         */
        onTypeClick(type) {
            if (type === this.mapType) return;

            this.mapType = type;
            this.layerCheckList = [];
            this.$emit('update:type', type);
            this.$emit('onMapTypeChange', type);
        },

        onTypeVisible(visible) {
            this.visible.type = visible;
        },

        onLayerVisible(visible) {
            this.visible.layer = visible;
        },

        onTimeVisible(visible) {
            this.visible.time = visible;
        },

        /**
         * 刷新时间点击事件
         */
        onTimeClick(time) {
            this.refreshTime = time;
            this.$emit('onRefreshTimeChange', time);
        },

        /**
         * 图层事件监听
         */
        onLayerChange(item) {
            if (this.layerCheckList.includes(item.value)) {
                // 新增图层
                item.layer = this.map.addLayer(item.value);
            } else {
                let layer = item.layer;

                // 如果当前图层存在子项，则一并取消
                if (item.child) {
                    layer = [item.layer];
                    item.child.forEach((n) => {
                        if (this.layerCheckList.includes(n.value)) {
                            let idx = this.layerCheckList.indexOf(n.value);
                            layer.push(n.layer);
                            this.layerCheckList.splice(idx, 1);
                        }
                    });
                }

                // 移除图层
                this.map.removeLayer(item.value, layer);
            }
        }
    }
};
</script>
