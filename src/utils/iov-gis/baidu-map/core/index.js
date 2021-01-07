/**
 * 百度地图封装类
 */
import Const from '../../const/const.js';

export {default as Marker} from '../baidu-marker.js';
export {default as Polyline} from '../baidu-polyline.js';
export {default as Circle} from '../baidu-circle.js';
export {default as Autocomplete} from '../baidu-autocomplete.js';
export {default as LocalSearch} from '../baidu-local-search.js';

export default class BaiduMap {
    constructor(opt) {
        // 创建地图实例，关闭底图可点功能
        this.map = new BMap.Map(opt.container, { enableMapClick: false });
        // 创建中心点坐标
        const point = new BMap.Point(...opt.center);
        // 初始化地图，设置中心点坐标和地图级别
        this.map.centerAndZoom(point, opt.zoom);
        this.map.enableScrollWheelZoom(true);

        BaiduMap.Size = BMap.Size;
        BaiduMap.Point = BMap.Point;
    }

    destroy() {
        // 百度地图官方目前没有销毁地图的方法，所以利用webview的DOM销毁
        this.map.clearOverlays();
    }

    /**
     * 添加图层
     * @param {String} type
     */
    addLayer(type) {
        let layer = null;

        switch (type) {
            case Const.LAYER_TYPE.TRAFFIC:
                layer = new BMap.TrafficLayer(); // 创建交通流量图层实例
                this.map.addTileLayer(layer);
                break;
            case Const.LAYER_TYPE.SATELLITE: // 卫星图
                this.map.setMapType(BMAP_SATELLITE_MAP);
                break;
            case Const.LAYER_TYPE.ROADNET: // 混合图：卫星+路网
                this.map.setMapType(BMAP_HYBRID_MAP);
                break;
        }

        return layer;
    }

    /**
     * 移除图层
     * @param {String} type
     * @param {TileLayer} layer
     */
    removeLayer(type, layer) {

        switch (type) {
            case Const.LAYER_TYPE.SATELLITE: // 移除卫星视图则是恢复普通街道视图
                this.map.setMapType(BMAP_NORMAL_MAP);
                break;
            case Const.LAYER_TYPE.ROADNET: // 移除卫星和路网的混合视图则是恢复卫星视图
                this.map.setMapType(BMAP_SATELLITE_MAP);
                break;
            default:
                this.map.removeTileLayer(layer);
        }
    }

    /**
     * 添加覆盖物
     * @param {*} overlay
     */
    addOverlay(overlay) {
        if (overlay instanceof Array) {
            overlay.forEach((item) => {
                this.map.addOverlay(item);
            });
        } else {
            this.map.addOverlay(overlay);
        }
    }

    /**
     * 移除覆盖物
     */
    removeOverlay(overlay) {
        if (overlay instanceof Array) {
            overlay.forEach((item) => {
                this.map.removeOverlay(item);
            });
        } else {
            this.map.removeOverlay(overlay);
        }
    }

    /**
     * 设置地图视野包含当前所有设备点位
     * 百度地图根据Point数组来设置；高德地图根据覆盖物数组来设置
     * @param {Array} arr
     */
    setViewport(arr) {
        // eslint-disable-next-line array-callback-return
        let tmp = arr.map((item) => {
            if (item instanceof BMap.Point) {
                return item;
            } else if (item instanceof BMap.Marker) {
                return item.getPosition();
            } else if (item instanceof Array) {
                return new BMap.Point(...item);
            }
        });

        this.map.setViewport(tmp);
    }

    /**
     * 地图缩放至指定级别并以指定点为地图显示中心点
     */
    setCenterAndZoom(lng, lat, zoom) {
        this.map.centerAndZoom(new BMap.Point(lng, lat), zoom);
    }

    /**
     * 判断指定经纬度是否在当前地图视野内
     * @returns {Boolean}
     */
    isInBounds(lng, lat) {
        let bound = this.map.getBounds(); // 地图可视区域
        return bound.containsPoint(new BMap.Point(lng, lat));
    }

    /**
     * 平滑移动到点
     * @param {float} lng
     * @param {float} lat
     */
    panToCenter(lng, lat) {
        this.map.panTo(new BMap.Point(lng, lat));
    }

    /**
     * 返回两个经纬度点之间的实际距离。单位：米
     * @param {Ponint} start
     * @param {Ponint} end
     */
    getDistance(start, end) {
        return this.map.getDistance(start, end);
    }
}
