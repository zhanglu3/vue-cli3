export default class BaiduMarker {
    constructor(longitude, latitude, icon = {}, markerInfo = {}) {
        this.markerInfo = markerInfo;
        this.point = new BMap.Point(longitude, latitude);
        this.icon = icon;
        this.marker = this.initMarker();
        this.overlayType = 'marker';
    }

    initMarker() {
        let _marker = null;
        if (JSON.stringify(this.icon) === '{}') {
            _marker = new BMap.Marker(this.point);
        } else {
            let myIcon = new BMap.Icon(
                this.icon.path,
                new BMap.Size(...this.icon.size),
                this.icon.opts
            );
            _marker = new BMap.Marker(this.point, { icon: myIcon });
            if (this.icon.offset) {
                _marker.setOffset(new BMap.Size(...this.icon.offset));
            }
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
        const _point = new BMap.Point(lng, lat);
        this.marker.setPosition(_point);
        if (typeof cb === 'function') {
            cb(_point);
        }
    }

    /**
     * 获取当前覆盖物最新坐标
     */
    getPosition() {
        return this.marker.getPosition();
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
        const iconObj = new BMap.Icon(icon.path, new BMap.Size(...icon.size));
        iconObj.setImageSize(icon.opts.imageSize);
        iconObj.setSize(new BMap.Size(...icon.size));

        let offset = icon.offset ? icon.offset : [0, 0];
        this.marker.setOffset(new BMap.Size(...offset));
        this.marker.setIcon(iconObj);
    }

    getMarkerInfo() {
        return this.markerInfo;
    }

    addMarkerEvent(type, cb) {
        this.marker.addEventListener(type, (e) => {
            cb(e, this.markerInfo, this);
        });
    }

    /**
     * 设置点的旋转角度
     * @param {Number} val
     */
    setHeadRotation(val) {
        this.marker.setRotation(val);
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
    setTop(bool) {
        this.marker.setTop(bool);
    }

    setLabel(label) {
        this.marker.setLabel(label);
    }
}
