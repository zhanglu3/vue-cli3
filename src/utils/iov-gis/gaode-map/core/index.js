/* eslint-disable class-methods-use-this */
/**
 * 高德地图封装类
 */
import Const from '../../const/const.js';

export {default as Marker} from '../gaode-marker.js';
export {default as Polyline} from '../gaode-polyline.js';
export {default as Circle} from '../gaode-circle.js';
export {default as Autocomplete} from '../gaode-autocomplete.js';
export {default as LocalSearch} from '../gaode-local-search.js';

export default class GaodeMap {
    constructor(opt) {
        // 创建地图实例
        this.map = new AMap.Map(opt.container, {
            center: opt.center,
            zoom: opt.zoom,
            showIndoorMap: false // 是否在有矢量底图的时候自动展示室内地图，PC端默认是true
        });

        GaodeMap.Size = AMap.Size;
        GaodeMap.Point = AMap.LngLat;
    }

    destroy() {
        this.map.destroy();
    }

    /**
     * 添加图层
     * @param {String} type
     */
    addLayer(type) {
        let layer = null;

        switch (type) {
            case Const.LAYER_TYPE.TRAFFIC:
                layer = new AMap.TileLayer.Traffic({
                    'autoRefresh': true, //是否自动刷新，默认为false
                    'interval': 180 //刷新间隔，默认180s
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

    /**
     * 移除图层
     * @param {String} type
     * @param {TileLayer} layer
     */
    removeLayer(type, layer) {
        this.map.remove(layer);
    }

    /**
     * 添加覆盖物
     * @param {*} overlay
     */
    addOverlay(overlay) {
        this.map.add(overlay);
    }

    /**
     * 移除覆盖物
     */
    removeOverlay(overlay) {
        this.map.remove(overlay);
    }

    /**
     * 设置地图视野包含当前所有设备点位
     * 百度地图根据Point数组来设置；高德地图根据覆盖物数组来设置
     * @param {Array} arr
     */
    setViewport(arr) {
        // eslint-disable-next-line array-callback-return
        let tmp = arr.filter(item => (item instanceof AMap.Marker || item instanceof AMap.Polyline || item instanceof AMap.Circle));
        // 高德地图根据覆盖物数组设置地图视野，参数缺省时为当前地图上添加的所有覆盖物图层
        // 空数组无法正确设置视野，需要转为null
        tmp = tmp.length ? tmp : null;
        this.map.setFitView(tmp);
    }

    /**
     * 地图缩放至指定级别并以指定点为地图显示中心点
     */
    setCenterAndZoom(lng, lat, zoom) {
        this.map.setZoomAndCenter(zoom, new AMap.LngLat(lng, lat));
    }

    /**
     * 判断指定经纬度是否在当前地图视野内
     * @returns {Boolean}
     */
    isInBounds(lng, lat) {
        let bound = this.map.getBounds(); // 地图可视区域
        return bound.contains(new AMap.LngLat(lng, lat));
    }

    /**
     * 平滑移动到点
     * @param {float} lng
     * @param {float} lat
     */
    panToCenter(lng, lat) {
        this.map.panTo(new AMap.LngLat(lng, lat));
    }

    /**
     * 返回两个经纬度点之间的实际距离。单位：米
     * @param {Ponint} start
     * @param {Ponint} end
     */
    getDistance(start, end) {
        return AMap.GeometryUtil.distance(start, end);
    }
}
