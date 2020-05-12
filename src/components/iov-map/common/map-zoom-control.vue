<style lang="less">
.co-map-zoom-control {
    text-align: center;
    background-color: #fff;
    border: 1px solid #d9dde4;
    border-radius: 2px;
    font-size: 12px;
    &-btn {
        width: 30px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
            color: #2d7dea;
            background-color: #f0f5fc;
        }
    }
    .divided::before {
        content: "";
        display: block;
        margin: 0 5px;
        height: 1px;
        background-color: #bfbfbf;
    }
}
</style>
<template>
    <div class="co-map-zoom-control">
        <div class="co-map-zoom-control-btn" @click="onZoom(1)"><i class="el-icon-plus"></i></div>
        <div class="co-map-zoom-control-btn divided" @click="onZoom(-1)"><i class="el-icon-minus"></i></div>
    </div>
</template>
<script>
export default {
    name: 'MapZoomControl',
    props: {
        map: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        onZoom(val) {
            val > 0 ? this.map.zoomIn() : this.map.zoomOut();
        }
    }
};
</script>
