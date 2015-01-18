define(function (require) {

    var inherits = require('util/inherits');
    var Page = require('pagemanager/Page');
    var PageManager = require('pagemanager/PageManager');
    var $ = require('jquery');

    function FramePage () {
        Page.call(this);
    }

    inherits(FramePage, Page);

    // 页面创建
    FramePage.prototype.onCreate = function(pageManager) {
        this.dom.innerHTML = this.html;
        var tabPm = new PageManager(this.dom.querySelector('.tab .content'));
        //tabPm.goTo($())
        var defaultTab = $('.tab ul>li.current');
        defaultTab.length < 1 && (defaultTab = $('.tab ul>li'));
        tabPm.goTo(defaultTab.data('tab'));
        $('.tab>ul>li', this.dom).click(function () {
            tabPm.goTo(this.dataset.tab);
        });
    };

    return FramePage;
});