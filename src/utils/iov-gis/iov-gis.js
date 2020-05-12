/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/**
 * 地图中间层
 */
import MapConst from './const/const.js';
import loadMap from './loadMap.js';
import IovgisLib from './iov-gis-lib.js';
import * as CoordsTransform from './utils/coordsTransform';

const BASE = {
    [MapConst.MAP_TYPE.BMAP]: () => import('./baidu-map/core'),
    [MapConst.MAP_TYPE.AMAP]: () => import('./gaode-map/core')
};

// 属于当前类的私有属性，所以提到类定义外
let coreMap = null; // 对应当前地图核心封装类的实例对象
let coreModule = null; // 对应当前地图封装类的模块

export default class Iovgis {
    constructor(opt) {
        this.container = opt.container;
        this.ak = opt.ak;
        this.type = opt.type; // 'BMAP'/'AMAP'
        this.center = opt.center || [116.397428, 39.90923]; // [经度，纬度]，默认为GCJ02坐标系下的天安门经纬度
        this.zoom = opt.zoom || 6;
        this.gisMap = null; // 地图实例
        this.onComplete = opt.onComplete; // 地图对象初始化完成后的回调方法
        this.onError = opt.onError; // 发生错误时的回调方法

        const getMapModule = BASE[this.type]; // 地图类型对应的原始基类

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
                    coreModule = module;
                    this.gisMap = coreMap.map;

                    Iovgis.init();

                    // 地图实例初始化完成回调方法
                    if (typeof this.onComplete === 'function') {
                        this.onComplete(this.gisMap);
                    }
                });
            })
            .catch((e) => {
                if (typeof this.onError === 'function') {
                    this.onError(e);
                }
            });
    }

    static init() {
        Iovgis.Util = {...CoordsTransform}; // 地图工具方法
        Iovgis.Marker = coreModule.Marker;
        Iovgis.PolyLine = coreModule.PolyLine;
        Iovgis.Circle = coreModule.Circle;
        Iovgis.Autocomplete = coreModule.Autocomplete;
        Iovgis.LocalSearch = coreModule.LocalSearch;
        Iovgis.Size = coreModule.default.Size;
        Iovgis.Point = coreModule.default.Point;
        Iovgis.Lib = {
            'DrawingManager': class {
                constructor(map, opts) {
                    return new IovgisLib(MapConst.MAP_LIB.DRAWING, map, opts);
                }
            }
        };
    }

    /**
     * 销毁地图
     */
    destroy() {
        if (!this.gisMap) return;
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
        if (!this.gisMap) return;
        return coreMap.addLayer(type);
    }

    /**
     * 移除图层
     */
    removeLayer(type, layer) {
        if (!this.gisMap) return;
        coreMap.removeLayer(type, layer);
    }

    /**
     * 添加覆盖物
     * @param {*} overlay
     */
    addOverlay(overlay) {
        // 从封装的覆盖物实例中过滤出地图覆盖物，自定义的覆盖物实例中都会有overlayType属性，用来标识覆盖物类型
        if (overlay instanceof Array) {
            overlay.filter((item) => {
                item = item.overlayType ? item[item.overlayType] : item;
                return item;
            });
        } else {
            overlay = overlay.overlayType ? overlay[overlay.overlayType] : overlay;
        }
        coreMap.addOverlay(overlay);
    }

    /**
     * 移除覆盖物
     */
    removeOverlay(overlay) {
        // 从封装的覆盖物实例中过滤出地图覆盖物
        if (overlay instanceof Array) {
            overlay.filter((item) => {
                item = item.overlayType ? item[item.overlayType] : item;
                return item;
            });
        } else {
            overlay = overlay.overlayType ? overlay[overlay.overlayType] : overlay;
        }
        coreMap.removeOverlay(overlay);
    }

    /**
     * 设置地图视野包含当前所有设备点位
     * 百度地图根据Point数组来设置；高德地图根据覆盖物数组来设置
     * @param {Array} arr
     */
    setViewport(arr) {
        let arrTemp = arr.map((item) => {
            // 从封装的覆盖物实例中过滤出地图覆盖物
            if (item instanceof Iovgis.Marker || item instanceof Iovgis.PolyLine || item instanceof Iovgis.Circle) {
                return item[item.overlayType];
            }
            if (item.lon && item.lat) {
                // 不属于覆盖物实例则取其经纬度
                return new Iovgis.Point(item.lon, item.lat);
            }
            return item;
        });

        coreMap.setViewport(arrTemp);
    }

    /**
     * 地图缩放至指定级别并以指定点为地图显示中心点
     */
    setCenterAndZoom(lng, lat, zoom) {
        coreMap.setCenterAndZoom(lng, lat, zoom);
    }

    /**
     * 判断指定经纬度是否在当前地图视野内
     */
    isInBounds(lng, lat) {
        return coreMap.isInBounds(lng, lat);
    }

    /**
     * 平滑移动到点
     * @param {float} lng
     * @param {float} lat
     */
    panToCenter(lng, lat) {
        this.gisMap.panTo(new Iovgis.Point(lng, lat));
    }

    /**
     * 返回两个经纬度点之间的实际距离。单位：米
     * @param {Object} start 起点经纬度
     * @param {Object} end 终点经纬度
     */
    getDistance(start, end) {
        // 为了兼容经度字段名，后台返回字段名为lon，但是地图API经度字段名为lng
        const startPoint = [start.lon || start.lng, start.lat];
        const endPoint = [end.lon || end.lng, end.lat];

        return coreMap.getDistance(new Iovgis.Point(...startPoint), new Iovgis.Point(...endPoint));
    }

    /**
     * 初始化测距对象
     *
     * @param {Object} opts
     * @param {Function} opts.deleteCallback     // 测距折线删除回调
     * @param {Function} opts.drawendCallback    // 测距结束回调
     *
     * @returns {IovgisLib} gisTool
     */
    initDistanceTool(opts) {
        return new Promise((resolve, reject) => {
            try {
                let gisTool = new IovgisLib(
                    MapConst.MAP_LIB.DISTANCE,
                    this,
                    {
                        ...opts,
                        onComplete: () => {
                            if (typeof opts.deleteCallback === 'function') {
                                gisTool.addEvent(MapConst.DISTANCE_EVENT_TYPE.DELETE, opts.deleteCallback);
                                gisTool.deleteCallback = opts.deleteCallback;
                            }
                            if (typeof opts.drawendCallback === 'function') {
                                gisTool.addEvent(MapConst.DISTANCE_EVENT_TYPE.DRAWEND, opts.drawendCallback);
                                gisTool.drawendCallback = opts.drawendCallback;
                            }
                            resolve(gisTool);
                        }
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 移除指定测距对象的事件绑定
     * @param {IovgisLib} gisLib
     */
    removeDistanceEvent(gisLib) {
        if (typeof gisLib.deleteCallback === 'function') {
            gisLib.removeEvent(MapConst.DISTANCE_EVENT_TYPE.DELETE, gisLib.deleteCallback);
        }
        if (typeof gisLib.drawendCallback === 'function') {
            gisLib.removeEvent(MapConst.DISTANCE_EVENT_TYPE.DRAWEND, gisLib.drawendCallback);
        }

    }
}
