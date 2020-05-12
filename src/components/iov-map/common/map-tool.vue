<style lang="less">
    .co-map-tool {
        .co-map-tool-ul {
            width: 34px;
            li {
                width: 100%;
                height: 32px;
                float: left;
                cursor: pointer;
                padding: 3px;
                box-sizing: border-box;
                text-align: center;
                font-size: 25px;
                color: #666;
                // 按钮悬浮图标变大
                &:hover {
                    font-size: 26px;
                }
                // 选中按钮高亮
                &.focus {
                    color: #2d7dea;
                }
            }
        }
    }
</style>
<template>
    <div class="co-map-tool" :style="{ ...position }">
        <ul class="co-map-tool-ul">
            <li
                v-for="(item, index) in toolsArray"
                :key="index" :title="item.text"
                :class="{'focus': focusType === item.type}"
                 @click.stop="selectTool(item.type)"
            ><iov-svg :icon-name="item.icon"></iov-svg>
            </li>
        </ul>
    </div>
</template>

<script>
import MapConst from '@/utils/iov-gis/const/const.js';

export default {
    name: 'MapTool',
    props: {
        position: Object,
        map: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            toolsArray: [
                {type: MapConst.MAP_TOOL.DISTANCE, text: '测距', icon: 'ruler'}
            ],
            focusType: '',
            distanceTool: {
                obj: null,
                count: 0
            }
        };
    },
    watch: {
        // 地图切换要重新初始化地图工具
        map: function() {
            this.initTool();
        },
        focusType(val) {
            if (val) {
                this.$emit('onToolSelect', val);
            } else {
                this.$emit('onToolSelect', false);
            }
        }
    },
    mounted() {
        this.initTool();
    },
    methods: {
        /**
         * 初始化地图工具
         */
        initTool() {
            // 初始化测距对象
            this.map.initDistanceTool({
                deleteCallback: this.distanceRemoveEvent, // 测距折线删除回调
                drawendCallback: this.distanceDrawendEvent // 测距结束回调
            }).then((val) => {
                this.distanceTool.obj = val;
            });
        },

        /**
         * 工具按钮点击事件
         *
         * @param {String} type    选中的工具类型
         */
        selectTool(type) {
            if (this.focusType === type) {
                return;
            }

            // 当选择新的工具时，前一种工具要先关闭
            this.closePreSelectTool();
            this.focusType = type;

            switch (type) {
                case MapConst.MAP_TOOL.DISTANCE:
                    if (this.distanceTool.count === 10) {
                        this.focusType = '';
                        this.$message({
                            message: '最多支持10条测距',
                            type: 'error'
                        });
                        return;
                    }
                    this.distanceTool.obj.open();
                    break;
            }
        },

        /**
         * 测距双击结束事件监听
         */
        distanceDrawendEvent(e) {
            if (Number(e.distance)) {
                this.distanceTool.count++;
            }
            this.focusType = '';
        },

        /**
         * 测距线段删除事件监听
         */
        distanceRemoveEvent() {
            this.distanceTool.count--;
            console.log(this.distanceTool.count);
        },

        /**
         * 关闭之前选中的地图工具
         */
        closePreSelectTool() {
            switch (this.focusType) {
                case MapConst.MAP_TOOL.DISTANCE:
                    // 关闭测距功能
                    this.distanceTool.obj.close(); // 会触发drawend事件
                    break;
            }
        },

        /**
         * 关闭地图工具
         */
        refCloseTool() {
            this.closePreSelectTool();
            this.focusType = '';
        }
    },
    beforeDestroy() {
        // 测距工具事件解绑
        this.map.removeDistanceEvent(this.distanceTool.obj);
    }
};
</script>
