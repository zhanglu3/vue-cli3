/**
 * 地图中间层
 */
import loadMap from 'gis/loadMap'
import Const from 'utils/const/const'
import CoordsTransform from 'gis/utils/coordsTransform'

const BASE = {
    [Const.MAP_TYPE.BMAP]: () => import('./baidu-map/core'),
    [Const.MAP_TYPE.AMAP]: () => import('./gaode-map/core')
}

export default class Iovgis {
    constructor(opt) {
        this.container = opt.container;
        this.ak = opt.ak;
        this.type = opt.type;                             // 'BMAP'/'AMAP'
        this.center = opt.center || [116.397428, 39.90923];    // [经度，纬度]，默认为GCJ02坐标系下的天安门经纬度
        this.zoom = opt.zoom || 15;
        this.gisMap = null;    // 地图对象实例
        this.Util = {...CoordsTransform};    // 地图工具方法

        const getMapModule = BASE[this.type];    // 地图类型对应的原始基类

        loadMap(this.type, this.ak)
            .then(() => {
                getMapModule().then((module) => {
                    const res = new module.default({
                        container: this.container,
                        center: this.center,
                        zoom: this.zoom
                    });
                    this.gisMap = res.map;
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    destroy() {
        if(this.type === Const.MAP_TYPE.AMAP){
            this.gisMap & this.gisMap.destroy();
        } else if(this.type === Const.MAP_TYPE.BMAP) {
            // 百度地图官方目前销毁地图的方法
            this.gisMap.clearOverlays();
        }
    }
}