# 页面管理框架


功能：对页面模块的封装，单页面的页面管理（页面跳转，动画...）。因为采用SPA模式，所以app的中的页面不再是传统的完整的html页面，需要一个页面管理框架，对这些页面进行管理，借鉴了Android app框架 (http://developer.android.com/guide/components/activities.html)。所有文件（包括html，css）为requirejs模块。

> 应用层 | **页面模块**，共享ui组件，数据模块，其他功能模块（分享，定位）
> ----- |-----
> 框架层 | **PageManager**，**Page**


### Page

HTML页面中分出的逻辑子页面，page.json进行描述，可以通过`PageManager.goTo(...)`跳过去。编译阶段一个页面模块将打包成一个js文件（requirejs模块）。

```
// 代码文件结构
proj_root
	src
		pages
			fav: 一个页面模块放一个文件夹下，如收藏页面
				page.json: 模块配置文件，必要
				xxx.js: 对该页面进行数据更新
				xxx.html: html片段
				xxx.css: 对该片段生效的样式。约束作用域
				xxx2.css: 可以有多个css属性
				image: ??
```

### 页面模块配置文件
html或js必选一

```
page.json:
{
    "lazy_load": false,	// 是否打包成单独的模块异步加载
    "html": "page.html",	// 页面片段文件
    "css": ["page.css"],	// 全局影响
    "js": "page",
    "dependencies": [],
    "fullscreen": "false",	// 暂不需要
    "animation": "slide-{dir}|fade|cover-{dir}|reveal-{dir}|pop|flip"	// refer: http://cdn.sencha.com/touch/sencha-touch-2.3.1a/built-examples/kitchensink/index.html#demo/SlideLeft, http://jqtjs.com/preview/demos/main/index.html#animations
}
```
### 页面控制模块API

为js类，负责响应app、与用户的交互，并更新页面ui，需继承Page。

```
	function Page () {
		this.dom = null;	// onCreate后可用，根据html片段生成的dom元素
    }

    inherits(Page, EventDispatcher);	// ?

    /**
     * 页面创建回调函数，对页面进行初始化操作
     * PageManager 全局app上下文，包含页面跳转，数据层的借口等
     */
	Page.prototype.onCreate = function(pageManager) {
	};

	/**
	 * 页面销毁，设备负载较大时销毁部分页面
	 */
	Page.prototype.onDestroy = function() {
	};

	/**
	 * 页面显示时的回调
	 */
    Page.prototype.onShow = function (param) {
    };

	/**
	 * 页面隐藏回调
	 */
    Page.prototype.onHide = function() {
    };

```

## PageManager API

**框架层**，负责Page生命周期

```
	/*
		conf {
        route: true or custome route, other wise disabled,
        appContext: any type
     }
     */
	function PageManager (pageContainer, conf) {
		this.context = conf.appContext;
	...
    }

    // 跳转到指定页面，自动加载响应模块, uri为页面所在目录
    PageManager.prototype.goTo = function(uri, param, ani) {
    ...
    };
    
    // 跳转到指定页面，自动加载响应模块, uri为页面所在目录
    PageManager.prototype.prepare = function(uri) {
    ...
    };
```

## 压缩打包
依赖requirejs node打包模块

1. 安装
	`npm install requirejs`
2. 打包
	`node build/build.js`

build/app.build.js

```
{
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
```

## Dependency
require.js 15K, 7K gziped,
or
curl.js 9K, 5K gziped,
