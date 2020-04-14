/**
 * 百度地图封装类
 */

export default class BaiduMap {
    constructor(opt) {
        // 创建地图实例，关闭底图可点功能
        this.map = new BMap.Map(opt.container, { enableMapClick: false });
        // 创建中心点坐标  
        const point = new BMap.Point(...opt.center);
        // 初始化地图，设置中心点坐标和地图级别
        this.map.centerAndZoom(point, opt.zoom);
        this.map.enableScrollWheelZoom(true);
    }
}