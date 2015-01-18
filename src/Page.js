define(function (require) {

function Page() {
    this.dom = null;
    this.uri = null;
    this.html = '';
    this.animation = 'slide';
}

Page.prototype.onCreate = function(pageManager) {
	this.dom.innerHTML = this.html;
};

Page.prototype.onShow = function(params) {

};

Page.prototype.onHide = function() {

};

Page.prototype.onDestroy = function() {
    this.dom = null;
    this.uri = null;
};

return Page;
});