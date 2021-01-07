/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/**
 * 地图工具类中间层
 */
import MapConst from './const/const.js';

const BASE = {
    [MapConst.MAP_LIB.DRAWING]: {
        [MapConst.MAP_TYPE.BMAP]: () => import('./baidu-map/lib/baidu-drawing-manager.js'),
        [MapConst.MAP_TYPE.AMAP]: () => import('./gaode-map/lib/gaode-drawing-manager.js')
    },
    [MapConst.MAP_LIB.DISTANCE]: {
        [MapConst.MAP_TYPE.BMAP]: () => import('./baidu-map/lib/baidu-distance-tool.js'),
        [MapConst.MAP_TYPE.AMAP]: () => import('./gaode-map/lib/gaode-distance-tool.js')
    }
};

export default class IovgisLib {
    constructor(libName, map, opts) {
        this.onComplete = opts.onComplete;
        this.onError = opts.onError;
        this.map = map;
        this.mapLib = null; // 对应当前地图封装工具类的实例对象
        this.libManager = null; // 第三方地图工具类实例

        const getLibModule = BASE[libName][map.type]; // 地图类型对应的工具类
        const initMapLibFunc = {
            [MapConst.MAP_LIB.DRAWING]: module => this.initDrawingLib(module, opts),
            [MapConst.MAP_LIB.DISTANCE]: module => this.initDistanceTool(module, opts)
        };

        // 按需加载对应地图的封装类文件
        getLibModule().then((module) => {
            // 初始化对应的库对象
            initMapLibFunc[libName](module);
        });
    }

    /**
     * 初始化鼠标绘制库对象
     */
    initDrawingLib(module, opts) {
        const styleOptions = {
            fillColor: '#ff7d41',
            strokeColor: '#ff7d41',
            strokeWeight: 4,
            fillOpacity: 0,
            strokeOpacity: 0.4
        };
        this.circleOptions = opts.circleOptions || styleOptions; //圆的样式
        this.polylineOptions = opts.polylineOptions || styleOptions; //线的样式
        this.polygonOptions = opts.polygonOptions || styleOptions; //多边形的样式
        this.rectangleOptions = opts.rectangleOptions || styleOptions; //矩形的样式

        let lib = new module.default(this.map.gisMap, {
            circleOptions: this.circleOptions,
            polylineOptions: this.polylineOptions,
            polygonOptions: this.polygonOptions,
            rectangleOptions: this.rectangleOptions,
            onComplete: (mapLib) => {
                this.mapLib = mapLib;
                this.libManager = mapLib.manager;
                // 地图工具实例初始化完成回调方法
                if (typeof this.onComplete === 'function') {
                    this.onComplete(this.libManager);
                }
            },
            onError: this.onError
        });
        return lib;
    }

    /**
     * 初始化测距库对象
     */
    initDistanceTool(module) {
        let lib = new module.default(this.map.gisMap, {
            onComplete: (mapLib) => {
                this.mapLib = mapLib;
                this.libManager = mapLib.manager;
                // 地图工具实例初始化完成回调方法
                if (typeof this.onComplete === 'function') {
                    this.onComplete(this.libManager);
                }
            },
            onError: this.onError
        });
        return lib;
    }

    /**
     * 事件绑定
     * @param {String} type 事件类型，对应MapConst.*_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    addEvent(type, cb) {
        return this.mapLib.addEvent(type, cb);
    }

    /**
     * 事件解绑
     * @param {String} type 事件类型，对应MapConst.*_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    removeEvent(type, cb) {
        this.mapLib.removeEvent(type, cb);
    }

    /**
     * 设置当前的绘制模式
     * @param {String} type 绘制模式，对应MapConst.DRAWING_TYPE中的枚举
     */
    setDrawingMode(type) {
        this.mapLib.setDrawingMode(type);
    }

    /**
     * 开启绘制/测距
     */
    open() {
        this.mapLib.open();
    }

    /**
     * 关闭绘制/测距
     */
    close() {
        this.mapLib.close();
    }

}
