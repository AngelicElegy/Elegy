const path = require('path')
module.exports = {
    lintOnSave: false,
    // 生产环境 : 纯前端 配置Proxy代理服务器解决跨域
    // 因后端已配置CROS，故注释
    // devServer: {
    //     proxy: {
    //         "/api": {
    //             target: 'http://127.0.0.1:8006/',
    //             pathRewrite: {
    //                 "^/api": ""
    //             },
    //             changeOrigin: true //允许跨域
    //         }
    //     }
    // },
    chainWebpack: (config) => {
        config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
      },
}