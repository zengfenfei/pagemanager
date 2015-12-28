var EventEmitter = require('events');
var util = require('util');
//!IS_RPODUCT && (console = require('../personal_console.js').get('pm.page'));

/**
 *
 * Page super class, https://developer.android.com/guide/components/activities.html
 *
 *  Android Activity life cycle demo

	```
 	Main-activity:﹕ onCreate
 	Main-activity:﹕ onStart
 	Main-activity:﹕ onResume

	Starting another activity.
 	Main-activity:﹕ onPause
 	Another-activity﹕ onCreate
 	Another-activity﹕ onStart
 	Another-activity﹕ onResume
 	Main-activity:﹕ onStop

	press back
 	Another-activity﹕ onPause
 	Main-activity:﹕ onRestart
 	Main-activity:﹕ onStart
 	Main-activity:﹕ onResume
 	Another-activity﹕ onStop
 	Another-activity﹕ onDestroy

	press back
 	Main-activity:﹕ onPause
 	Main-activity:﹕ onStop
 	Main-activity:﹕ onDestroy
	```

 *	@author kevinffzeng
 *	@constructor
 */
function Page() {
	EventEmitter.call(this);

	/**
		The page container dom
	*/
	this.view = null;

	/**
		The page id used to resolve the page class module.
		Page class module path: pagesBaseDirectory + pageId.
	*/
	this.id = null;
	this.params = null;

	this.title = null;

	this.manager = null;

	//this.animation = 'slide';
}

util.inherits(Page, EventEmitter);

/**
Creating the page.
@param {object} [params] The parameters, similar to android intent.
*/
Page.prototype.onCreate = function(params) {
	console.log('Page ' + this.id + ' onCreate', params);
};

Page.prototype.onParamsChanged = function(params) {
	console.log('Params changed to ', params);
};

/**
Return to the page. Page not visible.
*/
Page.prototype.onRestart = function() {
	console.log('Page ' + this.id + ' onRestart');
};

/**
About to show page. Page not visible.
*/
Page.prototype.onStart = function() {
	console.log('Page ' + this.id + ' onStart');
};

/**
Page is just visible.
*/
Page.prototype.onResume = function() {
	console.log('Page ' + this.id + ' onResume');
};

/**
About to leave the page, page is still visible
*/
Page.prototype.onPause = function() {
	console.log('Page ' + this.id + ' onPause');
};

/**
Page is not visible.
*/
Page.prototype.onStop = function() {
	console.log('Page ' + this.id + ' onStop');
};

/**
Destory the page.
*/
Page.prototype.onDestroy = function() {
	console.log('Page ' + this.id + ' onDestroy');
	this.view = null;
	this.id = null;
};

Page.prototype.uri = function() {
	return this.manager.route.toUri(this.id, this.params);
};

module.exports = Page;
