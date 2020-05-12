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

function bdToWgs(input) {
    const result = transform(
        input,
        BD09,
        WGS84
    );
    return result;
}

function wgsToBd(input) {
    const result = transform(
        input,
        WGS84,
        BD09
    );
    return result;
}

function wgsToGcj(input) {
    const result = transform(
        input,
        WGS84,
        GCJ02
    );
    return result;
}

function gcjToWgs(input) {
    const result = transform(
        input,
        GCJ02,
        WGS84
    );
    return result;
}

function gcjToBd(input) {
    const result = transform(
        input,
        GCJ02,
        BD09
    );
    return result;
}

function bdToGcj(input) {
    const result = transform(
        input,
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
