/**
 * 高德地图封装类
 */

export default class BaiduMap {
    constructor(opt) {
        // 创建地图实例  
        this.map = new AMap.Map(opt.container, {
            center: opt.center,
            zoom: opt.zoom
        });
    }
}