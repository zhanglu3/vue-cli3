import MapConst from '../../const/const.js';

const EventName = {
    [MapConst.DISTANCE_EVENT_TYPE.DELETE]: 'removepolyline',
    [MapConst.DISTANCE_EVENT_TYPE.DRAWEND]: 'drawend'
};

export default class BaiduDistanceTool {
    constructor(gisMap, opts) {
        this.gisMap = gisMap;

        BaiduDistanceTool.loadLibScript().then(() => {
            this.manager = new BMapLib.DistanceTool(this.gisMap);

            // 地图工具实例初始化完成回调方法
            if (typeof opts.onComplete === 'function') {
                opts.onComplete(this.manager);
            }
        }).catch((e) => {
            if (typeof opts.onError === 'function') {
                opts.onError(e);
            }
        });
    }

    static loadLibScript() {
        return new Promise(function(resolve, reject) {
            if (BMapLib && BMapLib.DistanceTool) {
                return resolve(BMapLib.DistanceTool);
            }
            window.onDisToolCallback = function() {
                resolve(BMapLib.DistanceTool);
            };

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.src = `${process.env.BASE_URL}lib/bmap/DistanceTool_min.js&callback=onDisToolCallback`;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 事件绑定
     * @param {String} type 事件类型，对应MapConst.DISTANCE_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    addEvent(type, cb) {
        this.manager.addEventListener(EventName[type], (e) => {
            cb(e, this);
        });
    }

    /**
     * 事件解绑
     * @param {String} type 事件类型，对应MapConst.DISTANCE_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    removeEvent(type, cb) {
        this.manager.removeEventListener(EventName[type], cb);
    }

    /**
     * 开启测距
     */
    open() {
        this.manager.open();
    }

    /**
     * 关闭测距
     */
    close() {
        this.manager.close();
    }
}
