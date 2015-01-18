define(function () {
    return function addStyle (cssText) {
        var style = document.createElement('style');
        style.innerHTML = cssText;
        document.head.appendChild(style);
    };
});