module.exports = {
    "baseUrl": "src",
    "out": "dist",  // 文件输出目录
    pagesDir: 'pages',   // 页面所在目录, 相对baseUrl
    "paths": {

    },
    mainConfigFile: './src/demo.js',    // 包含requre.config的模块
    "packages": [
        {
            name: 'demo',
            out: 'main.js',  // 输出文件名
            include: ['util/inherits', 'PageManager/Page']  // 自动在其他模块排除
        },
        {
            out: 'BusPage.js',
            includePage: ['bus', 'search'],   //引用的页面所在目录，相对于，pagesDir
            //include: ['text!pages/bus/page.json'],
            exclude: ['jquery', 'underscore']
        }
    ],
    pageEntry: 'page.json'  // 页面入口配置文件
}