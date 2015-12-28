var objectAssign = require('object-assign');
var defaultRoute = require('./hash_route.js');
//!IS_RPODUCT && (console = require('../personal_console.js').get('pm.manager'));

var CURRENT_PAGE_CLASS_NAME = 'current';

/**
 * conf
 {
    route: use custom route
    appContext: any type,   // The global context to avoid global variables
    pageDir: // The page class directory,
    defaultPage: // The default page id
    isInitialPage: // The first page of the page stack
    resolvePageClass: //func
 }
 */
function PageManager(pageContainer, conf) {
    //this._pageLoader = new PageLoader();
    this.defaultTitle = document.title;
    this.context = null;
    this._pageStack = [] // [Page] Attached pages
        //this._prevPage = null;  // 前一页
    this._pageContainer = pageContainer; // 页面容器 The container to hold all sub pages
    //this._lifeCycleManager = new PageLifeCycleManager();
    this.route = null;
    this.pageDir = null;
    this.defaultPage = null;
    this.initialPage = null; // The inital page id
    this.isInitialPage = null; // fn
    this.resolvePageClass = null; //fn
    this.defaultPageTitle = document.title;
    this.commonParams = {};

    init(this, conf || {});
}

function init(self, conf) {
    // FIXME: classList not supported on android 2.1
    //self._pageContainer.classList.add('page-container');
    self.route = conf.route || defaultRoute;
    self.context = conf.appContext;
    self.pageDir = conf.pageDir;
    self.defaultPage = conf.defaultPage;
    self.initialPage = conf.initialPage;
    self.isInitialPage = conf.isInitialPage;
    self.resolvePageClass = conf.resolvePageClass;

    var paramNames = conf.commonParams;
    if (paramNames && paramNames.length > 0) {
        for (var i = paramNames.length - 1; i >= 0; i--) {
            self.commonParams[paramNames[i]] = null;
        };
    }

    self.route.start(self);
}

PageManager.prototype.showDefaultPage = function() {
    if (!this.defaultPage) {
        console.error('No default page set for PageManager.');
        return;
    }
    this.goTo(this.defaultPage);
};

function createPage(self, id, params) {
    onPageCreate(self, id, params);
    var pageClass = self.resolvePageClass(id);
    var p = new pageClass();
    p.id = id;
    p.params = params;
    p.view = self._pageContainer.querySelector('#' + id.replace(/\//g, '-'));
    p.manager = self;
    self._pageStack.push(p);
    p.onCreate(params);
    return p;
}

function isInitialPage(self, id, params) {
    return self.initialPage === id && (!self.isInitialPage || self.isInitialPage(params));
}

function onPageCreate(self, id, params) {
    if (!isInitialPage(self, id, params)) {
        return;
    }
    saveCommonParams(self, params);
    console.log('The common params:', self.commonParams);
}

function saveCommonParams(self, params) {
    // Save common params
    for (var k in self.commonParams) {
        self.commonParams[k] = params[k];
    }
}

function onNavigateToNewPage(self, id, params) {
    //Add common params to route
    var commonParams = self.commonParams;
    for(var k in commonParams) {
        if (!params[k]) {
            params[k] = commonParams[k]
        }
    }
    self.route.replace(id, params);
}

// If the first page is not initial page, route back to the first page.
function beforeGoToPage(self, id, params) {
    if (self._pageStack.length > 0 ||
        isInitialPage(self, id, params)) {
        return;
    }
    // Show initial page first
    saveCommonParams(self, params);
    var initialPage = self.goTo(self.initialPage, self.commonParams);
    self.route.replace(self.initialPage, self.commonParams);
    initialPage.once('ok', function() {
        self.route.to(id, params);
    });
    return true;
}

function showPage(self, page) {
    page.onStart();
    page.view.classList.add(CURRENT_PAGE_CLASS_NAME);
    page.view.parentNode.appendChild(page.view);
    page.onResume();
    document.title = page.title || self.defaultPageTitle;
}

function hidePage(page) {
    page.onPause();
    page.view.classList.remove(CURRENT_PAGE_CLASS_NAME);
    page.onStop();
}

function getTopPage(self, i) {
    return self._pageStack[self._pageStack.length - 1 - i];
}

// Show page
PageManager.prototype.goTo = function(id, params, ani) {
    var self = this;
    var prevented = beforeGoToPage(self, id, params);
    if (prevented) {
        return;
    }
    var currentPage = getTopPage(self, 0);
    var p;
    if (currentPage) {
        if (currentPage.id == id) {
            console.log('Goto the same page.');
            onNavigateToNewPage(self, id, params);  //FIXME The function name is not properly used here.
            currentPage.onParamsChanged(params);
            p = currentPage;
        } else {
            var prvPage = getTopPage(self, 1);
            if (prvPage && prvPage.id === id) { // Back to previouse page
                p = prvPage;
                console.log('Go back to page ' + id);
                self._pageStack.pop();
                currentPage.onPause();
                currentPage.view.classList.remove(CURRENT_PAGE_CLASS_NAME);
                prvPage.onRestart();
                showPage(self, prvPage);
                currentPage.onStop();
                currentPage.onDestroy();
            } else { // Go to a new page
                console.log('Go to new page ' + id);
                onNavigateToNewPage(self, id, params);
                currentPage.onPause();
                currentPage.view.classList.remove(CURRENT_PAGE_CLASS_NAME);
                p = createPage(self, id, params);
                showPage(self, p);
                currentPage.onStop();
            }
        }
    } else { // Go to the first page
        console.log('Create the first page ' + id);
        p = createPage(self, id, params);
        showPage(self, p);
    }
    return p;
};

// 新页面以动画方式进入
function animateTo(currentPage, newPage, ani, cb) {
    if (!currentPage) { // 第一次打开页面无需动画
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

// 返回上页
PageManager.prototype.back = function() {

};

module.exports = PageManager;
