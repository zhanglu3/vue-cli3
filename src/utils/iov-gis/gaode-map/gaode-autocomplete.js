// 绑定事件缓存
const funcTmp = {};

export default class GaodeAutocomplete {
    constructor(opts) {
        this.map = opts.map;
        AMap.plugin('AMap.Autocomplete', () => {
            this.autoComplete = new AMap.Autocomplete({
                input: opts.input
            });
            if (typeof opts.onComplete === 'function') {
                opts.onComplete(this);
            }
        });
    }

    /**
     * 选中某个POI信息时触发此事件
     * @param {Function} cb
     */
    bindSelectEvent(cb) {
        let callback = (e) => {
            let poi = e.poi;
            cb([poi.location.lng, poi.location.lat], `${poi.district}${poi.name}`);
        };
        funcTmp['onconfirm'] = callback;
        this.autoComplete.on('select', callback);
    }

    /**
     * 解除选中事件绑定
     */
    unbindSelectEvent() {
        if (funcTmp['onconfirm']) {
            this.autoComplete.off('select', funcTmp['onconfirm']);
            delete funcTmp['onconfirm'];
        }
    }

    /**
     * 销毁对象
     */
    destroy() {
        this.unbindSelectEvent();
        // 由于高德未提供销毁方法，所以手动删除显示面板DOM
        var self = document.querySelectorAll('.amap-sug-result');
        // 拿到父节点
        var parent = self[0].parentElement;
        parent.removeChild(self[0]);
    }
}
