var querystring = require('querystring');
//!IS_RPODUCT && (console = require('../personal_console.js').get('pm.route'));

var route = {};
var routeChanged;

// uri -> {id: , params:}
function parseUri(uri) {
    var parts = uri.split('?');
    var pageUri = parts[0];
    var pageParam = parts[1] && querystring.parse(parts[1]);
    if (!pageUri) {
        console.log('No page uri specified in the hash.');
    }
    return {
        id: pageUri,
        params: pageParam
    };
}

// {id: , params:} -> uri
function toUri(id, params) {
    var uri = id;
    params && (uri += '?' + querystring.stringify(params));
    return uri;
}

route.toUri = toUri;

route.parseUri = parseUri;

//param: pagemanager
route.start = function(pm) {
    routeChanged && route.stop();
    routeChanged = function() {
        var hash = location.hash;
        if (!hash) {
            pm.showDefaultPage();
            return;
        }
        hash = hash.substr(1);
        var p = parseUri(hash);
        pm.goTo(p.id, p.params || {});
    };
    listenRouteChange();
    routeChanged();
};

function listenRouteChange() {
    window.addEventListener('hashchange', routeChanged, false);
}

route.stop = function() {
    window.removeEventListener('hashchange', routeChanged, false);
    //routeChanged = null;
};

route.to = function(id, params) {
    location.hash = toUri(id, params);
};

route.replace = function(id, params) {
    route.stop();
    var uri = '#' + toUri(id, params);
    console.log('Replace page uri to ' + uri);
    location.replace(uri);
    setTimeout(listenRouteChange, 0);;
};

module.exports = route;
