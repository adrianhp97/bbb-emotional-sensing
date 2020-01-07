"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var player_1 = __importDefault(require("./renderers/player"));
var en_player_json_1 = __importDefault(require("./translations/en.player.json"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('Player');
var H5PPlayer = /** @class */ (function () {
    function H5PPlayer(libraryLoader, urls, integration, content, customScripts) {
        if (customScripts === void 0) { customScripts = ''; }
        log.info('initialize');
        this.libraryLoader = libraryLoader;
        this.renderer = player_1["default"];
        this.translation = en_player_json_1["default"];
        this.integration = integration;
        this.content = content;
        this.customScripts = customScripts;
        this.urls = __assign({ baseUrl: '/html5clint/h5p', downloadUrl: '/download', libraryUrl: "/html5clint/h5p/libraries", scriptUrl: "/html5clint/h5p/core/js", stylesUrl: "/html5clint/h5p/core/styles" }, urls);
        this.baseUrl = this.urls.baseUrl;
        this.libraryUrl = this.urls.libraryUrl;
        this.stylesUrl = this.urls.stylesUrl;
        this.scriptUrl = this.urls.scriptUrl;
    }
    H5PPlayer.prototype.coreScripts = function () {
        var _this = this;
        return [
            'jquery.js',
            'h5p.js',
            'h5p-event-dispatcher.js',
            'h5p-x-api-event.js',
            'h5p-x-api.js',
            'h5p-content-type.js',
            'h5p-confirmation-dialog.js',
            'h5p-action-bar.js',
            'request-queue.js'
        ].map(function (file) { return _this.scriptUrl + "/" + file; });
    };
    H5PPlayer.prototype.coreStyles = function () {
        var _this = this;
        return ['h5p.css', 'h5p-confirmation-dialog.css'].map(function (file) { return _this.stylesUrl + "/" + file; });
    };
    H5PPlayer.prototype.generateIntegration = function (contentId, contentObject, h5pObject) {
        var _a;
        // see https://h5p.org/creating-your-own-h5p-plugin
        log.info("generating integration for " + contentId);
        return __assign({ contents: (_a = {},
                _a["cid-" + contentId] = __assign(__assign({}, this.content), { displayOptions: {
                        copy: false,
                        copyright: false,
                        embed: false,
                        "export": false,
                        frame: false,
                        icon: false
                    }, fullScreen: false, jsonContent: JSON.stringify(contentObject), library: this.mainLibraryString(h5pObject) }),
                _a), l10n: {
                H5P: this.translation
            }, postUserStatistics: false, saveFreq: false, url: this.baseUrl }, this.integration);
    };
    H5PPlayer.prototype.render = function (contentId, contentObject, h5pObject) {
        var _this = this;
        log.info("rendering page for " + contentId);
        var model = {
            contentId: contentId,
            customScripts: this.customScripts,
            downloadPath: this.generateDownloadPath(contentId),
            integration: this.generateIntegration(contentId, contentObject, h5pObject),
            scripts: this.coreScripts(),
            styles: this.coreStyles(),
            translations: {}
        };
        var libraries = {};
        return this.loadLibraries(h5pObject.preloadedDependencies || [], libraries).then(function () {
            _this.loadAssets(h5pObject.preloadedDependencies || [], model, libraries);
            return _this.renderer(model);
        });
    };
    H5PPlayer.prototype.useRenderer = function (renderer) {
        log.info('changing renderer');
        this.renderer = renderer;
        return this;
    };
    H5PPlayer.prototype.generateDownloadPath = function (contentId) {
        return this.urls.downloadUrl + "?contentId=" + contentId;
    };
    H5PPlayer.prototype.loadAssets = function (dependencies, assets, libraries, loaded) {
        var _this = this;
        if (libraries === void 0) { libraries = {}; }
        if (loaded === void 0) { loaded = {}; }
        log.verbose("loading assets from dependencies: " + dependencies
            .map(function (dep) {
            return dep.machineName + "-" + dep.majorVersion + "." + dep.minorVersion;
        })
            .join(', '));
        dependencies.forEach(function (dependency) {
            var name = dependency.machineName;
            var majVer = dependency.majorVersion;
            var minVer = dependency.minorVersion;
            var key = name + "-" + majVer + "." + minVer;
            if (key in loaded)
                return;
            loaded[key] = true;
            var lib = libraries[key];
            _this.loadAssets(lib.preloadedDependencies || [], assets, libraries, loaded);
            var path = _this.libraryUrl + "/" + key;
            (lib.preloadedCss || []).forEach(function (asset) {
                return assets.styles.push(path + "/" + asset.path);
            });
            (lib.preloadedJs || []).forEach(function (script) {
                return assets.scripts.push(path + "/" + script.path);
            });
        });
    };
    H5PPlayer.prototype.loadLibraries = function (dependencies, loaded) {
        var _this = this;
        log.verbose("loading libraries from dependencies: " + dependencies
            .map(function (dep) {
            return dep.machineName + "-" + dep.majorVersion + "." + dep.minorVersion;
        })
            .join(', '));
        return new Promise(function (resolve) {
            Promise.all(dependencies.map(function (dependency) {
                return new Promise(function (rslv) {
                    var name = dependency.machineName;
                    var majVer = dependency.majorVersion;
                    var minVer = dependency.minorVersion;
                    var key = name + "-" + majVer + "." + minVer;
                    if (key in loaded)
                        return rslv();
                    return _this.loadLibrary(name, majVer, minVer).then(function (lib) {
                        loaded[key] = lib;
                        _this.loadLibraries(lib.preloadedDependencies || [], loaded).then(function () { return rslv(); });
                    });
                });
            })).then(function () { return resolve(); });
        });
    };
    H5PPlayer.prototype.loadLibrary = function (machineName, majorVersion, minorVersion) {
        log.verbose("loading library " + machineName + "-" + majorVersion + "." + minorVersion);
        return Promise.resolve(this.libraryLoader(machineName, majorVersion, minorVersion));
    };
    H5PPlayer.prototype.mainLibraryString = function (h5pObject) {
        var library = (h5pObject.preloadedDependencies || []).find(function (lib) { return lib.machineName === h5pObject.mainLibrary; });
        if (!library)
            return undefined;
        var name = library.machineName;
        var majVer = library.majorVersion;
        var minVer = library.minorVersion;
        return name + " " + majVer + "." + minVer;
    };
    return H5PPlayer;
}());
exports["default"] = H5PPlayer;
//# sourceMappingURL=H5PPlayer.js.map