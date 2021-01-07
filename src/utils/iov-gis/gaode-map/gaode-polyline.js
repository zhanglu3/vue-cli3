export default class GaodePolyline {
    constructor(arr, opts) {
        let arrPoints = arr.map(item => new AMap.LngLat(item.lon, item.lat));
        const defaultOpts = {
            strokeColor: '#4AC634',
            strokeWeight: 5,
            strokeOpacity: 1,
            lineCap: 'round', // 折线两端线帽的绘制样式
            lineJoin: 'round' // 折线拐点连接处样式
        };

        opts = Object.assign(defaultOpts, opts);
        this.polyline = new AMap.Polyline({
            path: arrPoints,
            ...opts
        });
        this.overlayType = 'polyline';
    }

    /**
     * 设置折线的点数组
     * @param {Array<Object>} arr
     */
    setArrPath(arr) {
        let arrPoints = arr.map(item => new AMap.LngLat(item.lon, item.lat));
        this.polyline.setPath(arrPoints);
    }
}
