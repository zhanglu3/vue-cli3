export default class BaiduAutocomplete {
    constructor(opts) {
        this.autoComplete = new BMap.Autocomplete({
            input: opts.input,
            location: opts.location || '全国'
        });
    }

    /**
     * 选中某个POI信息时触发此事件
     * @param {Function} cb
     */
    bindSelectEvent(cb) {
        this.autoComplete.addEventListener('onconfirm', (e) => {
            cb(e, this);
        });
    }
}
