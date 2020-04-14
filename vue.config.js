let path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
    configureWebpack: {
        // externals: {
        //     AMap: 'AMap', // 高德地图配置
        //     T: 'T', // 天地图
        //     BMap: 'BMap', // 百度地图配置
        // },
        resolve: {
            alias: {
                'utils': resolve('./src/utils'),
                'gis': resolve('./src/utils/gis'),
                '@': resolve('src')
            }
        },
    }
};