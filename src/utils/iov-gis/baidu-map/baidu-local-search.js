export default class BaiduLocalSearch {
    constructor(map, opts) {
        this.localSearch = new BMap.LocalSearch(map.gisMap, {
            onSearchComplete(res) {
                let point = res.getPoi(0).point;
                opts.onSearchComplete && opts.onSearchComplete(point);
            }
        });
    }

    /**
     * 根据关键词搜索
     * @param {String} val
     */
    search(val) {
        this.localSearch.search(val);
    }
}
