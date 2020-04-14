import Const from 'utils/const/const';

export default function loadMap(type, ak) {
    const PATH = {
        [Const.MAP_TYPE.BMAP]: `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onMapCallback`,
        [Const.MAP_TYPE.AMAP]: `https://webapi.amap.com/maps?v=1.4.15&key=${ak}&callback=onMapCallback`
    }

    return new Promise(function(resolve, reject) {
        if (type === Const.MAP_TYPE.BMAP) {
            if (typeof BMap !== 'undefined') {
                return resolve(BMap);
            }
            window.onMapCallback = function() {
                resolve(BMap)
            }
        } else if (type === Const.MAP_TYPE.AMAP) {
            if (typeof AMap !== 'undefined') {
                return resolve(AMap);
            }
            window.onMapCallback = function() {
                resolve(AMap)
            }
        }
        
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.charset = 'utf-8'
        script.src = PATH[type]
        script.onerror = reject
        document.head.appendChild(script)
    })
  }