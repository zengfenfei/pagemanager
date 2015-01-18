define(function (require) {
    var PageLoader = require('./PageLoader');
    var PageAnimations = require('./PageAnimation');
    var PageLifeCycleManager = require('./PageLifeCycleManager');

    var pageManagerCss = require('text!./page.css');
    require('./util/addStyle')(pageManagerCss);


    /**
     * conf
     {
        route: true(default route) or custom route, other wise disabled,
        appContext: any type,
     }
     */
    function PageManager (pageContainer, conf) {
        conf = conf || {};
        this._pageLoader = new PageLoader();
        this.context = conf.appContext;  //
        this._pages = {}; // {uri: new Page} Attached pages
        this._pageStacks = [];   // 页面访问记录
        //this._prevPage = null;  // 前一页
        this._pageContainer = pageContainer;  // 页面容器 The container to hold all sub pages
        this._lifeCycleManager = new PageLifeCycleManager();
        this._route = null;

        this.init(conf);
    }

    PageManager.prototype.init = function(conf) {
        this._pageContainer.classList.add('page-container');
        this._pageContainer.innerHTML = '';

        this._initRoute(conf.route);
    };

    PageManager.prototype._initRoute = function(route) {
        if (!route) {
            return;
        }
        if (route === true) {
            this._route = require('./Route');
        } else if (route.uriToPage instanceof Function && route.pageToUri instanceof Function) {
            this._route = route;
        } else {
            console.warn('Bad route. Route should be:{uriToPage: func, pageToUri: func}');
            return;
        }

        var self = this;
        window.addEventListener('hashchange', function () {
            var hash = location.hash;
            hash.charAt(0) === '#' && (hash = hash.substr(1));
            var p = self._route.uriToPage(hash);
            self.goTo(p.uri, p.params);
        }, false);
    };

    // 跳转到指定页面，自动加载响应模块
    PageManager.prototype.goTo = function(uri, param, ani) {
        this._lifeCycleManager.touch(uri);
        var self = this;
        var p = this._pages[uri];
        var currentPage = this._pageStacks[this._pageStacks.length - 1];
        var prevPage = this._pageStacks[this._pageStacks.length - 2];
        if (currentPage && p === currentPage) {
            //console.warn('Going to the same page.');
            return;
        }
        if (p) {
            p.onShow(param);
            animateTo(currentPage, p, ani, function () {
                currentPage && currentPage.onHide();
            });
            if (p === prevPage) {   // 回退，按了back
                this._pageStacks.pop();
            } else {
                this._pageStacks.push(p);
            }
            //currentPage && currentPage.onHide();
            this._route && (location.hash = this._route.pageToUri(uri, param));
        } else {
            var self = this;
            this.prepare(uri, function() {
                self.goTo(uri, param, ani);
            });
        }
    };

    // 新页面以动画方式进入
    function animateTo (currentPage, newPage, ani, cb) {
        if (!currentPage) {   // 第一次打开页面无需动画
            cb();
            return;
        }
        ani = ani || newPage.animation;
        if (!ani) {
            cb();
            return;
        }
        var aniFunc = PageAnimations[ani];
        if (!aniFunc) {
            console.warn('Page animation ' + ani + ' not defined.');
            cb();
            return;
        }
        aniFunc(currentPage.dom, newPage.dom, cb);
    }

    // 预加载页面
    PageManager.prototype.prepare = function(uri, cb) {
        var self = this;
        this._lifeCycleManager.ensureResource(this);
        var reusedPage = this._lifeCycleManager.getReusedPage(uri);
        if (reusedPage) {
            this._addPage(uri, reusedPage);
            cb && cb();
            return;
        }
        this._pageLoader.load(uri, function (page) {
            if (!page) {
                console.warn('Page ' + uri + ' doesnot exists');
                return;
            }
            self._addPage(uri, page);
            cb && cb();
        });
    };


    PageManager.prototype.destroyPage = function(uri) {
        console.log('Destorying page '+uri);
        var page =  this._pages[uri];
        this._pages[uri] = null;
        this._pageContainer.removeChild(page.dom);
        page.onDestroy();
        return page;
    };

    // 返回上页
    PageManager.prototype.back = function() {

    };

    PageManager.prototype._addPage = function(uri, page) {
        page.uri = uri;
        page.dom = document.createElement('div');
        page.dom.className = uri;
        this._pages[uri] = page;
        this._pageContainer.insertBefore(page.dom, this._pageContainer.firstChild);
        page.onCreate(this);
    };

/*    PageManager.prototype._hideCurrentPage = function() {
        if (!this._currentPage) {
            return;
        }
        this._currentPage.dom.classList.remove(this.CURRENT_PAGE_CLASS_NAME);
        this._currentPage.onHide();
    };

    PageManager.prototype.CURRENT_PAGE_CLASS_NAME = 'current';
*/
    // function PageRoute (conf, pm) {
    //     this.conf = conf;
    //     this.pageManager = pm;
    // }

    // PageRoute.prototype.init = function() {
    //     window.addEventListener('hashchange', this, false);
    //     var hash = location.hash && location.hash.slice(1);
    //     if (!hash) {
    //         location.hash = this.conf.home;
    //     } else {
    //         this.showPageByHash();
    //     }
    // };

    // PageRoute.prototype.showPageByHash = function(evt) {
    //     var hash = location.hash && location.hash.slice(1);
    //     var pageUri = this.conf[hash] || hash;
    //     this.pageManager.goTo(pageUri);
    // };

    // PageRoute.prototype.handleEvent = PageRoute.prototype.showPageByHash;

    return PageManager;
});