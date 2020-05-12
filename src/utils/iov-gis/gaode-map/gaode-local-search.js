export default class GaodeLocalSearch {
    constructor(map, opts) {
        AMap.plugin('AMap.PlaceSearch', () => {
            this.localSearch = new AMap.PlaceSearch({});
            this.onSearchComplete = opts.onSearchComplete;
        });
    }

    /**
     * 根据关键词搜索
     * @param {String} val
     */
    search(val) {
        this.localSearch.search(val, (status, res) => {
            if (status === 'complete') {
                let point = res.poiList.pois.length ? res.poiList.pois[0].location : {};
                this.onSearchComplete && this.onSearchComplete(point);
            }
        });
    }
}
