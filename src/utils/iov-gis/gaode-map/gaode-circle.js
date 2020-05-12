export default class GaodeCircle {
    constructor(lon, lat, radius, opts) {
        const defaultOpts = {
            fillColor: '#ff7d41',
            strokeColor: '#ff7d41',
            strokeWeight: 4,
            fillOpacity: 0.2,
            strokeOpacity: 0.4
        };

        opts = Object.assign(defaultOpts, opts);
        this.circle = new AMap.Circle({
            center: new AMap.LngLat(lon, lat),
            radius: radius,
            ...opts
        });
        this.overlayType = 'circle';
    }

    setCricleRadius(radius) {
        this.circle.setRadius(radius);
    }

    getCricleRadius() {
        return this.circle.getRadius();
    }

    setCricleCenter(lng, lat) {
        this.circle.setCenter(new AMap.LngLat(lng, lat));
    }

    getCricleCenter() {
        const point = this.circle.getCenter();
        return {lng: point.getLng(), lat: point.getLat()};
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
