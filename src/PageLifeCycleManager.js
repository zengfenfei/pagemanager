define(function () {
    var MAX_MEMORY = 0.8;   // 0 ~ 1
    var MAX_PAGES = 20; //


    function PageLifeCycleManager () {
        this._pageUriAccessQueue = [];  // 活跃页面队列，Page uri 数组，最新访问过的uri移到队尾
        this._destroyedPages = {};  // {uri: page}
    }

    /**
     * 如果资源紧张（占用的内存太多，打开的页面太多），销毁页面
     * 清理过多页面，保证资源足够，使页面能正常响应
     */
    PageLifeCycleManager.prototype.ensureResource = function(pageMgr) {
        if (!this._isResourceIntensive()) {
            return;
        }
        var leastActivePageUri = this._pageUriAccessQueue.shift();
        this._destroyedPages[leastActivePageUri] = pageMgr.destroyPage(leastActivePageUri);
    };

    /**
     * 通知最新使用的页面，以使页面不会被销毁
     */
    PageLifeCycleManager.prototype.touch = function(uri) {
        var i = this._pageUriAccessQueue.indexOf(uri);
        if (i != -1) {
            this._pageUriAccessQueue.splice(i, 1);
        }
        this._pageUriAccessQueue.push(uri);
    };

    /**
     * 复用被销毁的页面
     */
    PageLifeCycleManager.prototype.getReusedPage = function(uri) {
        var page = this._destroyedPages[uri];
        this._destroyedPages[uri] = null;
        return page;
    };

    PageLifeCycleManager.prototype._isResourceIntensive = function() {
        if (this._pageUriAccessQueue.length > MAX_PAGES) {
            return true;
        }

        var memUsage = console.memory;
        if (!memUsage) {
            return false;
        }

        return memUsage.usedJSHeapSize / memUsage.jsHeapSizeLimit > MAX_MEMORY;
    };


    return PageLifeCycleManager
});