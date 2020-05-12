export default class GaodeMarker {
    constructor(longitude, latitude, icon = {}, markerInfo = {}) {
        this.markerInfo = markerInfo;
        this.point = new AMap.LngLat(longitude, latitude);
        this.icon = icon;
        this.marker = this.initMarker();
        this.overlayType = 'marker';
    }

    initMarker() {
        let _marker = null;
        let offset = [0, 0];
        if (JSON.stringify(this.icon) === '{}') {
            _marker = new AMap.Marker({
                position: this.point,
                anchor: 'center', // 为了跟百度地图保持一致，默认标记锚点在中心
                offset: new AMap.Pixel(0, 0) // 点标记显示位置偏移量默认改为0
            });
        } else {
            let myIcon = new AMap.Icon({
                size: new AMap.Size(...this.icon.size),
                image: this.icon.path,
                ...this.icon.opts
            });
            offset = this.icon.offset ? this.icon.offset : offset;
            _marker = new AMap.Marker({
                position: this.point,
                anchor: 'center',
                offset: new AMap.Pixel(...offset),
                icon: myIcon
            });
        }
        return _marker;
    }

    /**
     * 更新坐标
     * @param {*} lng 经度
     * @param {*} lat 纬度
     * @param {*} cb 更新完成的回调方法
     */
    setNewPosition(lng, lat, cb) {
        const _point = new AMap.LngLat(lng, lat);
        this.marker.setPosition(_point);
        if (typeof cb === 'function') {
            cb(_point);
        }
    }

    /**
     * 获取当前覆盖物最新坐标
     */
    getPosition() {
        const point = this.marker.getPosition();
        return {lng: point.getLng(), lat: point.getLat()};
    }

    /**
     * 更新图标
     * @param {Object} icon
     * @param {String} icon.path
     * @param {Array<Number>} icon.size
     * @param {Array<Number>} icon.offset 非必填
     * @param {Object} icon.opts
     * @param {Iovgis.Size} icon.opts.imageSize
     */
    setIcon(icon) {
        const newIcon = new AMap.Icon({
            size: new AMap.Size(...icon.size),
            image: icon.path,
            ...icon.opts
        });
        let offset = icon.offset ? icon.offset : [0, 0];
        this.marker.setOffset(new AMap.Pixel(...offset));

        this.marker.setIcon(newIcon);
    }

    getMarkerInfo() {
        return this.markerInfo;
    }

    addMarkerEvent(type, cb) {
        this.marker.on(type, (e) => {
            cb(e, this.markerInfo, this);
        });
    }

    /**
     * 设置点的旋转角度
     * @param {Number} val
     */
    setHeadRotation(val) {
        this.marker.setAngle(val);
    }

    openInforWindow(inw) {
        this.marker.openInfoWindow(inw.infoWindow);
    }
    setZIndex(zindex) {
        this.marker.setZIndex(zindex);
    }

    /**
     * 置顶覆盖物
     * @param {Boolean} isTop 当isTop为true时，marker将显示在最前面；当为false时，marker取消置顶
     */
    setTop(isTop) {
        this.marker.setTop(isTop);
    }

    setLabel(label) {
        this.marker.setLabel(label);
    }
}
