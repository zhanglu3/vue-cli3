class BaiduPolyLine {

    constructor(arr, opts) {
        let arrPoints = arr.map(item => new BMap.Point(item.lon, item.lat));
        const defaultOpts = {
            strokeColor: '#4AC634',
            strokeWeight: 5,
            strokeOpacity: 1
        };

        opts = Object.assign(defaultOpts, opts);
        this.polyline = new BMap.Polyline(arrPoints, opts);
        this.overlayType = 'polyline';
    }

    /**
     * 设置折线的点数组
     * @param {Array<Object>} arr
     */
    setArrPath(arr) {
        let airPoints = arr.map(item => new BMap.Point(item.lon, item.lat));
        this.polyline.setPath(airPoints);
    }
}

export default BaiduPolyLine;
