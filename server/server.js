"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var core_1 = require("@angular/core");
var platform_server_1 = require("@angular/platform-server");
var module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
var dotenv_1 = require("dotenv");
var express = require("express");
var fs_1 = require("fs");
var path = require("path");
require("reflect-metadata");
require("zone.js/dist/zone-node");
var environment_1 = require("../src/environments/environment");
dotenv_1.config();
var app = express();
var PORT = process.env.port || process.env.PORT || 4200;
var LOCATION = process.env.LOCATION || 'DEVELOPMENT';
console.log("SERVER LOCATION:  " + LOCATION);
if (LOCATION === 'PRODUCTION') {
    core_1.enableProdMode();
}
site();
function site() {
    var template = fs_1.readFileSync(path.join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();
    var _a = require('../dist/server/main'), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
    var envVars = {};
    // TODO GET the env vars and change them to json structure all on the server side
    // then on the browser side just have to merge environment and injectedEnvVars and keep the browser side clean!!
    injectEnvVars(environment_1.environment, undefined, envVars);
    app.engine('html', function (_, options, callback) {
        var opts = {
            document: template,
            url: options.req.url,
            extraProviders: [
                module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP),
                {
                    provide: 'injectedEnvVars',
                    useValue: envVars
                }
            ]
        };
        platform_server_1.renderModuleFactory(AppServerModuleNgFactory, opts).then(function (html) {
            callback(null, html);
        });
    });
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, '..', 'dist', 'browser'));
    app.use(express.static(path.join(__dirname, '..', 'dist', 'browser', 'assets', 'static'), {
        index: false
    }));
    app.get('*.*', express.static(path.join(__dirname, '..', 'dist', 'browser')));
    app.get('*', function (req, res) {
        res.render('index', { req: req });
    });
}
function injectEnvVars(environmentObject, propertyName, envVars, propertyPath) {
    if (propertyPath === void 0) { propertyPath = []; }
    var environmentObjectProperty = propertyName
        ? environmentObject[propertyName]
        : environmentObject;
    if (environmentObjectProperty instanceof Object) {
        var nextVars_1;
        if (propertyName) {
            envVars[propertyName] = {};
            nextVars_1 = envVars[propertyName];
        }
        else {
            nextVars_1 = envVars;
        }
        Object.keys(environmentObjectProperty).forEach(function (propertyKey) {
            injectEnvVars(environmentObjectProperty, propertyKey, nextVars_1, propertyName ? propertyPath.concat([propertyName]) : propertyPath);
        });
    }
    else {
        var envVarName = propertyPath.concat([propertyName]).map(function (p) { return splitCasedString(p, '_'); })
            .map(function (p) { return p.toUpperCase(); })
            .join('_');
        var envVarValue = process.env[envVarName];
        if (envVarValue !== null && envVarValue !== undefined) {
            console.log("setting " + propertyPath.join('.') + "." + propertyName + " to ENV." + envVarName + " with value: " + envVarValue);
            envVars[propertyName] = envVarValue;
        }
    }
}
function splitCasedString(text, splitCharacter) {
    if (splitCharacter === void 0) { splitCharacter = ' '; }
    if (text) {
        var splitOnCapital = text.match(/[A-Z]*[^A-Z]+/g);
        return splitOnCapital ? splitOnCapital.join(splitCharacter) : '';
    }
    else {
        return '';
    }
}
app.listen(PORT, function () {
    console.log("listening on http://localhost:" + PORT);
});
