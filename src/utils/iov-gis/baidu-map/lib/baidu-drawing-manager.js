export default class BaiduDrawingManager {
    constructor(gisMap, opts) {
        this.gisMap = gisMap;

        BaiduDrawingManager.loadLibScript().then(() => {
            this.manager = new BMapLib.DrawingManager(this.gisMap, {
                isOpen: false, // 是否开启绘制模式
                enableDrawingTool: false, // 是否显示工具栏
                circleOptions: opts.circleOptions, // 圆的样式
                polylineOptions: opts.polylineOptions, // 线的样式
                polygonOptions: opts.polygonOptions, // 多边形的样式
                rectangleOptions: opts.rectangleOptions // 矩形的样式
            });

            // 地图工具实例初始化完成回调方法
            if (typeof opts.onComplete === 'function') {
                opts.onComplete(this);
            }
        }).catch((e) => {
            if (typeof opts.onError === 'function') {
                opts.onError(e);
            }
        });
    }

    static loadLibScript() {
        return new Promise(function(resolve, reject) {
            if (window.BMapLib && BMapLib.DrawingManager) {
                return resolve(BMapLib.DrawingManager);
            }
            window.onDrawManagerCallback = function() {
                resolve(BMapLib.DrawingManager);
            };

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.src = `${process.env.BASE_URL}lib/bmap/DrawingManager_min.js&callback=onDrawManagerCallback`;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 事件绑定
     * @param {String} type 事件类型，对应MapConst.DRAWING_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    addEvent(type, cb) {
        this.manager.addEventListener(type, (e) => {
            cb(e, this);
        });
    }

    /**
     * 设置当前的绘制模式
     * @param {String} type 绘制模式，对应MapConst.DRAWING_TYPE中的枚举
     */
    setDrawingMode(type) {
        this.manager.setDrawingMode(type);
    }

    /**
     * 开启绘制
     */
    open() {
        this.manager.open();
    }

    /**
     * 关闭绘制
     */
    close() {
        this.manager.close();
    }
}
