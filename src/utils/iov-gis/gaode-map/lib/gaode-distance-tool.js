import MapConst from '../../const/const.js';

const EventName = {
    [MapConst.DISTANCE_EVENT_TYPE.DELETE]: 'removenode',
    [MapConst.DISTANCE_EVENT_TYPE.DRAWEND]: 'end'
};

const EventTmp = {};

export default class GaodeDrawingManager {
    constructor(gisMap, opts) {
        this.gisMap = gisMap;
        this.type = '';
        this.lastPoint = null;
        this.endPoints = new Proxy([], {
            // 由于高德API未提供整段测距删除事件，所以针对删除按钮额外添加onclick事件绑定
            // 因为删除按钮为动态添加，如果获取dom写在drawend事件回调里，按钮还未渲染获取不到
            // 为了保证获取到删除按钮，加了0.2s延迟
            set: function(target, propKey, value) {
                let index = Number(propKey);
                if (!Number.isNaN(index)) {
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        GaodeDrawingManager.bindDelBtnClick();
                    }, 300);
                }
                return Reflect.set(target, propKey, value);
            }
        });

        try {
            AMap.plugin(['AMap.RangingTool'], () => {
                this.manager = new AMap.RangingTool(gisMap);
                this.manager.on('addnode', this.addnodeCallback, this);
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
     * 每添加一个量测点时触发此事件
     * @param {*} e
     */
    addnodeCallback(e) {
        this.lastPoint = e.marker;
    }

    /**
     * 最新新增终点的删除按钮添加onclick事件绑定
     */
    static bindDelBtnClick() {
        const delBtns = document.querySelectorAll('.delimg');
        if (!delBtns.length) return;
        delBtns[delBtns.length - 1].onclick = (evt) => { // 最新添加的终点在数组的最后
            EventTmp[MapConst.DISTANCE_EVENT_TYPE.DELETE] && EventTmp[MapConst.DISTANCE_EVENT_TYPE.DELETE](evt);
        };
    }

    /**
     * 事件绑定
     * @param {String} type 事件类型，对应MapConst.DISTANCE_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    addEvent(type, cb) {
        // 由于高德API未提供整段测距删除事件，所以对删除事件回调做一个缓存
        EventTmp[type] = cb;
        let callback = (res) => {
            if (type === MapConst.DISTANCE_EVENT_TYPE.DRAWEND) {
                this.endPoints.push(this.lastPoint);
                this.close(); // 为了与百度地图统一，在一次测距结束后关闭测距
            }
            // 因为高德提供途经点的删除功能，并且单个点的删除会触发removenode事件，所以添加判断是否为全部删除
            if (type === MapConst.DISTANCE_EVENT_TYPE.DELETE && res.distance) {
                // 多段测距删除单个终点则会生成一个新的删除按钮，所以需要重新绑定点击事件
                // 因无法区分是终点还是途经点，所以只要删除一个点就重新绑定最后一个终点（新增的终点总是在最后）
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    GaodeDrawingManager.bindDelBtnClick();
                }, 500);
                return;
            }
            cb(res, this);
        };
        this.manager.on(EventName[type], callback, this);
        return callback;
    }

    /**
     * 事件解绑
     * @param {String} type 事件类型，对应MapConst.DISTANCE_EVENT_TYPE中的枚举
     * @param {Function} cb 绑定的回调方法
     */
    removeEvent(type, cb) {
        this.manager.off(EventName[type], cb);
        if (this.endPoints.length) this.endPoints = [];
    }

    /**
     * 开启测距
     */
    open() {
        this.manager.turnOn();
    }

    /**
     * 关闭测距
     */
    close() {
        this.manager.turnOff();
    }
}
