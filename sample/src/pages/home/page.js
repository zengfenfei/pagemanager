define(function (require) {

    var inherits = require('util/inherits');
    var Page = require('pagemanager/Page');

    function FavPage () {
        Page.call(this);
    }

    inherits(FavPage, Page);

    // 页面创建
    FavPage.prototype.onCreate = function(pageManager) {
        this.dom.innerHTML = this.html;
        $('.size-info>ul>li>a', this.dom).each(function(i, e) {
            e.textContent += ': ' + eval(e.dataset.var || e.textContent);
            console.log(e);
        });
    };

    return FavPage;
});