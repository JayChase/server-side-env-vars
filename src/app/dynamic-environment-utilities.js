"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DynamicEnvironmentUtilities = /** @class */ (function () {
    function DynamicEnvironmentUtilities() {
    }
    DynamicEnvironmentUtilities.prototype.crawlEnvironment = function (path, environmentObject, propertyName, injectedEnvVars) {
        var _this = this;
        var property = propertyName
            ? environmentObject[propertyName]
            : environmentObject;
        if (property instanceof Object) {
            // console.log(`crawling object ${propertyName}`);
            Object.keys(property).forEach(function (propertyKey) {
                _this.crawlEnvironment(propertyName ? path.concat([propertyName]) : path, property, propertyKey, injectedEnvVars);
            });
        }
        else {
            var envVarName = path.concat([propertyName]).map(function (p) { return _this.splitCasedString(p, '_'); })
                .map(function (p) { return p.toUpperCase(); })
                .join('_');
            var envVarValue = injectedEnvVars[envVarName];
            if (envVarValue !== null && envVarValue !== undefined) {
                // console.log(
                //   `setting ${path.join(
                //     '.'
                //   )}.${propertyName} to ENV.${envVarName} with value: ${envVarValue}`
                // );
                environmentObject[propertyName] = envVarValue;
            }
        }
    };
    DynamicEnvironmentUtilities.prototype.splitCasedString = function (text, splitCharacter) {
        if (splitCharacter === void 0) { splitCharacter = ' '; }
        if (text) {
            var splitOnCapital = text.match(/[A-Z]*[^A-Z]+/g);
            return splitOnCapital ? splitOnCapital.join(splitCharacter) : '';
        }
        else {
            return '';
        }
    };
    return DynamicEnvironmentUtilities;
}());
exports.DynamicEnvironmentUtilities = DynamicEnvironmentUtilities;
