var path = require('path');
var requirejs = require('requirejs');

var appBuildConfig = require('./app.build.js');

buildApp(appBuildConfig);

function buildApp (appConf) {
    appConf.pagesDir = appConf.pagesDir || '';
    appConf.pageEntry = appConf.pageEntry || 'page.json';
    for (var i = 0; i < appConf.packages.length; i++) {
        var pkgConf = appConf.packages[i];
        pkgConf.baseUrl = appConf.baseUrl;
        pkgConf.out = path.join(appConf.out, pkgConf.out);
        pkgConf.mainConfigFile = appConf.mainConfigFile;
        pkgConf.pagesDir = appConf.pagesDir;
        pkgConf.pageEntry = appConf.pageEntry;
        pkgConf.exclude = pkgConf.exclude || [];
        pkgConf.include = pkgConf.include || [];
        if (i != 0){
            pkgConf.exclude = pkgConf.exclude.concat(appConf.packages[0].include);
        }
        buildPackage(pkgConf, appConf);
    };
}

function buildPackage (pkgConf, appConf) {
    var pages = pkgConf.includePage;
    if (pages) {
        pkgConf.exclude.push('text');
        for (var i = 0; i < pages.length; i++) {
            resolvePageModules(pages[i], pkgConf, appConf);
        };
        //pkgConf.includePage
    }
    requirejs.optimize(pkgConf, function (buildResponse) {
        console.log(buildResponse);
    }, function (err) {
        console.log('Build package ' + pkgConf.name + ' failed, ' + err);
    });
}

function resolvePageModules (pageUri, pkgConf, appConf) {
    var pageDir = path.join(pkgConf.pagesDir, pageUri);
    // # 1 page config
    pkgConf.include.push('text!' + path.join(pageDir, appConf.pageEntry));
    //pkgConf.include[i] = pages[i]
    var pageConf = require(path.join(__dirname, '..', appConf.baseUrl, pageDir, appConf.pageEntry));
    var jsModule = pageConf.js;
    if (jsModule) {
        pkgConf.include.push(path.join(pageDir, jsModule));
    }

}

