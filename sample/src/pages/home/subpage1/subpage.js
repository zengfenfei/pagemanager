define(function (require) {
    var inherits = require('util/inherits');
    var Page = require('pagemanager/Page');

    function SubPage () {
        Page.call(this);
    }

    inherits(SubPage, Page);

    SubPage.prototype.onCreate = function (pm) {
        this.dom.innerHTML = this.html;
        //this.dom.style.backgroundColor = 'orange';
    };

    return SubPage;
});