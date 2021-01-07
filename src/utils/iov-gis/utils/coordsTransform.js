import { transform, WGS84, GCJ02, BD09 } from 'gcoord';

function baiduTransWgsToBd (pointArr, cb) {
    if (typeof BMap !== 'undefined') {
        const convertor = new BMap.Convertor();
        convertor.translate(pointArr, 1, 5, (data) => {
            cb && cb(data);
        });
    }
}

function baiduTransGcjToBd (pointArr, cb) {
    if (typeof BMap !== 'undefined') {
        const convertor = new BMap.Convertor();
        convertor.translate(pointArr, 3, 5, (data) => {
            cb && cb(data);
        });
    }
}

function bdToWgs(lng, lat) {
    const result = transform(
        [lng, lat],
        BD09,
        WGS84
    );
    return result;
}

function wgsToBd(lng, lat) {
    const result = transform(
        [lng, lat],
        WGS84,
        BD09
    );
    return result;
}

function wgsToGcj(lng, lat) {
    const result = transform(
        [lng, lat],
        WGS84,
        GCJ02
    );
    return result;
}

function gcjToWgs(lng, lat) {
    const result = transform(
        [lng, lat],
        GCJ02,
        WGS84
    );
    return result;
}

function gcjToBd(lng, lat) {
    const result = transform(
        [lng, lat],
        GCJ02,
        BD09
    );
    return result;
}

function bdToGcj(lng, lat) {
    const result = transform(
        [lng, lat],
        BD09,
        GCJ02
    );
    return result;
}

export {
    baiduTransWgsToBd,
    baiduTransGcjToBd,
    bdToWgs,
    wgsToBd,
    wgsToGcj,
    gcjToWgs,
    gcjToBd,
    bdToGcj
};
