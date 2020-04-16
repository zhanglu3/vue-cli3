/**
 * 高德地图封装类
 */
import Const from 'utils/const/const'

export default class BaiduMap {
    constructor(opt) {
        // 创建地图实例  
        this.map = new AMap.Map(opt.container, {
            center: opt.center,
            zoom: opt.zoom
        });
    }

    destroy() {
        this.map.destroy();
    }

    addLayer(type) {
        let layer = null;

        switch(type) {
            case Const.LAYER_TYPE.TRAFFIC:
                layer = new AMap.TileLayer.Traffic({
                    'autoRefresh': true,     //是否自动刷新，默认为false
                    'interval': 180,         //刷新间隔，默认180s
                });
                break;
            case Const.LAYER_TYPE.SATELLITE:
                layer = new AMap.TileLayer.Satellite();
                break;
            case Const.LAYER_TYPE.ROADNET:
                layer = new AMap.TileLayer.RoadNet();
                break;
        }
        this.map.add(layer);

        return layer;
    }

    removeLayer(type, layer) {
        this.map.remove(layer);
    }
}