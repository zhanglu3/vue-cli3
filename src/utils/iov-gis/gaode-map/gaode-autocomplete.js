export default class GaodeAutocomplete {
    constructor(opts) {
        AMap.plugin('AMap.Autocomplete', function() {
            this.autoComplete = new AMap.Autocomplete({
                input: opts.input
            });
        });
    }

    /**
     * 选中某个POI信息时触发此事件
     * @param {Function} cb
     */
    bindSelectEvent(cb) {
        this.autoComplete.on('select', (res) => {
            cb(res, this);
        });
    }
}
