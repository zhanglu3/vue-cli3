/**
 * 地图中间层
 */
import loadMap from 'gis/loadMap'
import Const from 'utils/const/const'
import * as CoordsTransform from 'gis/utils/coordsTransform'

const BASE = {
    [Const.MAP_TYPE.BMAP]: () => import('./baidu-map/core'),
    [Const.MAP_TYPE.AMAP]: () => import('./gaode-map/core')
}

// 属于当前类的私有属性，所以提到类定义外
let coreMap = null;    // 当前对应地图封装类的实例对象

export default class Iovgis {
    constructor(opt) {
        this.container = opt.container;
        this.ak = opt.ak;
        this.type = opt.type;                             // 'BMAP'/'AMAP'
        this.center = opt.center || [116.397428, 39.90923];    // [经度，纬度]，默认为GCJ02坐标系下的天安门经纬度
        this.zoom = opt.zoom || 15;
        this.gisMap = null;    // 地图实例
        this.Util = {...CoordsTransform};    // 地图工具方法
        this.onComplete = opt.onComplete;    // 地图对象初始化完成后的回调方法

        const getMapModule = BASE[this.type];    // 地图类型对应的原始基类

        // 按需加载对应地图的script
        loadMap(this.type, this.ak)
            .then(() => {
                // 按需加载对应地图的封装类文件
                getMapModule().then((module) => {
                    coreMap = new module.default({
                        container: this.container,
                        center: this.center,
                        zoom: this.zoom
                    });
                    this.gisMap = coreMap.map;
                    // 地图实例初始化完成回调方法
                    if (typeof this.onComplete === 'function') {
                        this.onComplete(this.gisMap);
                    }
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    /**
     * 销毁地图
     */
    destroy() {
        if(!this.gisMap) return;
        coreMap.destroy();
    }

    /**
     * 地图放大一级
     */
    zoomIn() {
        this.gisMap.zoomIn();
    }

    /**
     * 地图缩小一级
     */
    zoomOut() {
        this.gisMap.zoomOut();
    }

    /**
     * 添加图层
     */
    addLayer(type) {
        if(!this.gisMap) return;
        return coreMap.addLayer(type);
    }

    /**
     * 移除图层
     */
    removeLayer(type, layer) {
        if(!this.gisMap) return;
        coreMap.removeLayer(type, layer);
    }
}