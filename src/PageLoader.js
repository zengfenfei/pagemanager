define(function (require) {
    var Page = require('./Page');
    var addStyle = require('./util/addStyle');
    var PAGES_DIR = 'pages';    // 页面存放的目录
    var PAGE_CONF_FILE = 'page.json';   // 页面的配置文件

    function PageLoader() {
        this._callbacks = {};    // 正在加载中的页面 {pageDir: [cb1, cb2], fav: [cb1, cb2]}
    }

    // cb(page), 多次同时加载返回相同Page对象
    PageLoader.prototype.load = function(pageDir, cb) {
        if (!cb instanceof Function) {
            console.error('Load page callback must be a function.');
            return;
        }
        var thePageCallbacks = this._callbacks[pageDir];
        if (thePageCallbacks) {
            thePageCallbacks.push(cb);
            return;
        }
        var configPath = 'text!' + PAGES_DIR + '/' + pageDir + '/' + PAGE_CONF_FILE;
        this._callbacks[pageDir] = [cb];
        console.log('Loading Page ' + pageDir +' manifest ' + configPath);
        var self = this;
        require([configPath], function (pageConf) {
            var pageConf = JSON.parse(pageConf);
            self._loadPageRes(pageConf, pageDir
                );
        }, function(err) {
            console.error('Loading page config failed.', err.requireModules, err.message);
            cb(null, err);
        });
    };

    PageLoader.prototype._loadPageRes = function(pageConf, pageDir) {
        if (!pageConf.html && !pageConf.js) {
            console.error('Html or js file is neccessary for page ' + pageDir);
            return;
        }
        var html = pageConf.html;
        var pageClass = pageConf.js;
        var cssFiles = pageConf.css || [];
        var requirePaths = [];
        html && (requirePaths.push(getRequirePath(pageDir + '/' + html, 'text')));
        pageClass && (requirePaths.push(getRequirePath(pageDir + '/' + pageClass)));
        for (var i = 0; i < cssFiles.length; i++) {
            requirePaths.push(getRequirePath( pageDir + '/' + cssFiles[i], 'text'));
        };
        var self = this;
        require(requirePaths, function () {
            var htmlText, pageFunc, cssTexts;
            var cursor = 0;
            if (html) {
                htmlText = arguments[cursor];
                cursor++;
            }
            if (pageClass) {
                pageFunc = arguments[cursor];
                cursor++;
            } else {
                pageFunc = Page;
            }
            var page = new pageFunc();
            // init
            htmlText && (page.html = htmlText);
            //page.uri = pageDir;
            // make callbacks

            for (var i = cursor; i < arguments.length; i++) {
                addStyle(arguments[i]);
            };
            var cbs = self._callbacks[pageDir];
            for (var i = 0; i < cbs.length; i++) {
                cbs[i](page);
            };
            delete self._callbacks[pageDir];
        });
    };

    function getRequirePath(res, type) {
        type && (type += '!');
        return (type || '') + PAGES_DIR + '/'+ res;
    }

    return PageLoader;
});
