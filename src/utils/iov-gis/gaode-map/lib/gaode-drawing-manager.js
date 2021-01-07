import Const from '../../const/const.js';

export default class GaodeDrawingManager {
    constructor(gisMap, opts) {
        this.gisMap = gisMap;
        this.circleOptions = opts.circleOptions; //圆的样式
        this.polylineOptions = opts.polylineOptions; //线的样式
        this.polygonOptions = opts.polygonOptions; //多边形的样式
        this.rectangleOptions = opts.rectangleOptions; //矩形的样式
        this.type = '';

        try {
            AMap.plugin(['AMap.MouseTool'], () => {
                this.manager = new AMap.MouseTool(gisMap);
                // 地图工具实例初始化完成回调方法
                if (typeof opts.onComplete === 'function') {
                    opts.onComplete(this);
                }
            });
        } catch (error) {
            if (typeof opts.onError === 'function') {
                opts.onError(error);
            }
        }
    }

    /**
     * 事件绑定
     * @param {String} type 事件类型
     * @param {Function} cb 绑定的回调方法
     */
    addEvent(drawType, cb) {
        this.manager.on('draw', (res) => { // 高德地图的鼠标绘制工具只有draw事件
            cb(res.obj, this);
        });
    }

    /**
     * 设置当前的绘制模式
     * @param {String} type 绘制模式，对应Const.DRAWING_TYPE中的枚举
     */
    setDrawingMode(type) {
        this.type = type;
    }

    /**
     * 开启绘制
     */
    open() {
        switch (this.type) {
            case Const.DRAWING_TYPE.MARKER:
                this.manager.marker(this.markerOptions);
                break;
            case Const.DRAWING_TYPE.CIRCLE:
                this.manager.ciecle(this.circleOptions);
                break;
            case Const.DRAWING_TYPE.POLYLINE:
                this.manager.polyline(this.polylineOptions);
                break;
            case Const.DRAWING_TYPE.POLYGON:
                this.manager.polygon(this.polygonOptions);
                break;
            case Const.DRAWING_TYPE.RECTANGLE:
                this.manager.rectangle(this.rectangleOptions);
                break;
            default:
                break;
        }
    }

    /**
     * 关闭绘制
     */
    close() {
        this.manager.close();
    }
}
