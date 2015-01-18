define(function() {
    function encodeUrlParams (obj) {
        var urlEncoded = [];
        for(var k in obj) {
            urlEncoded.push(k + '=' + encodeURIComponent(obj[k]));
        }
        return urlEncoded.join('&');
    }

    return encodeUrlParams;
});