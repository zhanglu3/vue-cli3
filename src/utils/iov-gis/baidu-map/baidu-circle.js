export default class BaiduCircle {
    constructor(lon, lat, radius, opts) {
        const defaultOpts = {
            fillColor: '#ff7d41',
            strokeColor: '#ff7d41',
            strokeWeight: 4,
            fillOpacity: 0.2,
            strokeOpacity: 0.4
        };

        opts = Object.assign(defaultOpts, opts);
        this.circle = new BMap.Circle(new BMap.Point(lon, lat), radius, opts);
        this.overlayType = 'circle';
    }

    setCricleRadius(radius) {
        this.circle.setRadius(radius);
    }

    getCricleRadius() {
        return this.circle.getRadius();
    }

    setCricleCenter(lng, lat) {
        this.circle.setCenter(new BMap.Point(lng, lat));
    }

    getCricleCenter() {
        return this.circle.getCenter();
    }

    getBounds() {
        return this.circle.getBounds();
    }

    show() {
        this.circle.show();
    }

    hide() {
        this.circle.hide();
    }
}
