define(function (require) {
console.log('search page');
    var inherits = require('util/inherits');
    var Page = require('pagemanager/Page');
    //var $ = require('jquery');

    function FavPage () {
        Page.call(this);
    }

    inherits(FavPage, Page);

    FavPage.prototype.onCreate = function(pageManager) {
        this.dom.innerHTML = this.html;
        /*$('button', this.dom).click(function () {
            pageManager.goTo('home');
        });*/
    };


    return FavPage;
});