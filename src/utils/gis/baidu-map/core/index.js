/**
 * 百度地图封装类
 */
import Const from 'utils/const/const'

export default class BaiduMap {
    constructor(opt) {
        // 创建地图实例，关闭底图可点功能
        this.map = new BMap.Map(opt.container, { enableMapClick: false });
        // 创建中心点坐标  
        const point = new BMap.Point(...opt.center);
        // 初始化地图，设置中心点坐标和地图级别
        this.map.centerAndZoom(point, opt.zoom);
        this.map.enableScrollWheelZoom(true);
    }

    destroy() {
        // 百度地图官方目前没有销毁地图的方法
        this.map.clearOverlays();
    }

    addLayer(type) {
        let layer = null;

        switch(type) {
            case Const.LAYER_TYPE.TRAFFIC:
                layer = new BMap.TrafficLayer();    // 创建交通流量图层实例      
                this.map.addTileLayer(layer);
                break;
            case Const.LAYER_TYPE.SATELLITE:        // 卫星图
                this.map.setMapType(BMAP_SATELLITE_MAP);
                break;
            case Const.LAYER_TYPE.ROADNET:          // 混合图：卫星+路网
                this.map.setMapType(BMAP_HYBRID_MAP);
                break;
        }

        return layer;
    }

    removeLayer(type, layer) {

        switch(type) {
            case Const.LAYER_TYPE.SATELLITE:       // 移除卫星视图则是恢复普通街道视图
                this.map.setMapType(BMAP_NORMAL_MAP);
                break;
            case Const.LAYER_TYPE.ROADNET:         // 移除卫星和路网的混合视图则是恢复卫星视图
                this.map.setMapType(BMAP_SATELLITE_MAP);
                break;
            default:
                this.map.removeTileLayer(layer);
        }
    }
}