/**
 * 地图常量类
 */
export default class MapConst {
    static MAP_TYPE = {
        BMAP: 'BMAP',
        AMAP: 'AMAP'
    }

    static LAYER_TYPE = {
        TRAFFIC: 1, // 路况
        SATELLITE: 2, // 卫星
        ROADNET: 3 // 路网
    }

    static MAP_LIB = {
        DRAWING: 'DrawingManager', // 鼠标绘制
        DISTANCE: 'DistanceTool' // 测距
    }

    static DRAWING_TYPE = {
        MARKER: 'marker',
        CIRCLE: 'circle',
        POLYLINE: 'polyline',
        POLYGON: 'polygon',
        RECTANGLE: 'rectangle'
    }

    static DRAWING_EVENT_TYPE = { // 对应BMap鼠标绘制API中的时间名称
        OVERLAY: 'overlaycomplete', // 鼠标绘制完成后，派发总事件的接口
        MARKER: 'markercomplete', // 绘制点完成后，派发的事件接口
        CIRCLE: 'circlecomplete', // 绘制圆完成后，派发的事件接口
        POLYLINE: 'polylinecomplete', // 绘制线完成后，派发的事件接口
        POLYGON: 'polygoncomplete', // 绘制多边形完成后，派发的事件接口
        RECTANGLE: 'rectanglecomplete' // 绘制矩形完成后，派发的事件接口
    }

    static DISTANCE_EVENT_TYPE = { // 为了解决BMap与AMap事件名称不统一问题
        DELETE: 'deleteAll', // 删除测距折线
        DRAWEND: 'drawend' // 测距双击结束
    }

    static MAP_TOOL = { // 地图工具栏
        DISTANCE: 'distanceMeasure' // 测距
    }
}
