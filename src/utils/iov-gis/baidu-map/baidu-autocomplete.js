import LocalSearch from './baidu-local-search.js';

// 绑定事件缓存
const funcTmp = {};

export default class BaiduAutocomplete {
    constructor(opts) {
        this.map = opts.map;
        this.autoComplete = new BMap.Autocomplete({
            input: opts.input,
            location: opts.map.gisMap || '全国'
        });
        if (typeof opts.onComplete === 'function') {
            opts.onComplete(this);
        }
    }

    /**
     * 选中某个POI信息时触发此事件
     * @param {Function} cb
     */
    bindSelectEvent(cb) {
        let callback = (e) => {
            let val = e.item.value;
            let myValue = val.province + val.city + val.district + val.street + val.business;
            // 查询POI对应经纬度
            let localSearch = new LocalSearch(this.map, {
                onSearchComplete(pp) {
                    cb([pp.lng, pp.lat], myValue);
                }
            });
            localSearch.search(myValue);
        };
        funcTmp['onconfirm'] = callback;
        this.autoComplete.addEventListener('onconfirm', callback);
    }

    /**
     * 解除选中事件绑定
     */
    unbindSelectEvent() {
        if (funcTmp['onconfirm']) {
            this.autoComplete.removeEventListener('onconfirm', funcTmp['onconfirm']);
            delete funcTmp['onconfirm'];
        }
    }

    /**
     * 销毁对象
     */
    destroy() {
        this.unbindSelectEvent();
        this.autoComplete.dispose();
    }
}
