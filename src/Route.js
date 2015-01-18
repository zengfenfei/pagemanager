define(function (require) {
    var decodeUrlParams = require('./util/decodeUrlParams');
    var encodeUrlParams = require('./util/encodeUrlParams');

    var route = {};

    // Route navigator to a page with hash, hash -> {uri: , params: },
    route.uriToPage = function (uri) {
        var parts = uri.split('?');
        var pageUri = parts[0];
        var pageParam = parts[1] ? decodeUrlParams(parts[1]) : {};

        return {uri: pageUri, params: pageParam};
    };

    // page put back uri to hash
    route.pageToUri = function (uri, params) {
        var paramsStr = encodeUrlParams(params);
        paramsStr && (uri += '?' + paramsStr)
        return uri;
    };

    return route;
});