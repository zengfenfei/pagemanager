require.config({
    baseUrl:'src',
    paths: {
        // Core Libraries
        pagemanager: '../../src',
        "jquery": "../../lib/zepto.min",
        "text": "../../lib/text",
        'util/inherits': '../../src/util/inherits'
    },
    shim: {
        "jquery": {
            "exports": "Zepto"
        }
    }
});

require(['pagemanager/PageManager' ],function(PageManager) {
    window.pageManager = new PageManager(document.getElementById('page-container'), {route: true});
    pageManager.goTo('home');
});