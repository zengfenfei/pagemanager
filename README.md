# 单页面应用框架SPA

在单页面应用中，整个WebApp只有一个Html页面，App由虚拟页面组成，来实现相对独立的功能画面的切换。所有虚拟页面写在同一html文件将给开发与维护带来极大困难，该框架用来实现虚拟页面开发期的模块化，以及运行期的管理。

## 核心功能

1. 单页面中的虚拟页面的模块化，按需加载
2. 虚拟页面生命周期管理
3. 页面切换效果
4. 页面路由,自動設置頁面title	~~
5. 打包，项目级别的打包


# 使用指南

## 依赖

requirejs(+text plugin), zepto(modules: zepto event fx)

## 快速入门


[完整API](docs/api.md)

* 创建目录结构, 并下载依赖库

	```
	proj
		lib
			require.js
			text.js
			zepto.min.js
		src
			main.js // requirejs 入口模块
		index.html
	```
* 下载整个src文件夹到proj/lib, 重命名为pagemanager或其他

	```
	proj
		lib
			pagemanager <-- src
	```
* main.js，配置依赖模块路径

	```
	require.config({
    paths: {
        // Core Libraries
        pagemanager: '../lib/pagemanager',
        "jquery": "../lib/zepto.min",
        "text": "../lib/text"
    },
    shim: {
        "jquery": {
            "exports": "Zepto"
        }
    }
});

	require(['pagemanager/PageManager'],function(PageManager) {
    window.pageManager = new PageManager(document.getElementById('page-container'));
    pageManager.goTo('home');
});
	```

# 案例
[腾讯实时公交](http://bus.map.qq.com)

## 参考
* http://onsenui.io/
* bigpipe

# TODO

* 页面配置文件集中一个js文件，不用json方便注释和打包，同时可供打包工具使用
* 页面创建方式更简单
* 保留独立css文件？
* QQ Webivew 可能存在路由异常
* Page创建方式，配置文件，api？
