"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * Stores configuration options and literals that are used throughout the system.
 * Also loads and saves the configuration of changeable values (only those as "user-configurable") in the storage object.
 */
var EditorConfig = /** @class */ (function () {
    /**
     * @param {IStorage} storage A key-value storage object that persists the changes to the disk or gets them from the implementation/plugin
     */
    function EditorConfig(storage) {
        this.ajaxPath = '/html5client/ajax?action=';
        this.baseUrl = '/html5client/h5p';
        /**
         * Time after which the content type cache is considered to be outdated in milliseconds.
         * User-configurable.
         */
        this.contentTypeCacheRefreshInterval = 1 * 1000 * 60 * 60 * 24;
        /**
         * A list of file extensions allowed for content files. (Extensions separated by whitespaces)
         */
        this.contentWhitelist = 'json png jpg jpeg gif bmp tif tiff svg eot ttf woff woff2 otf webm mp4 ogg mp3 m4a wav txt pdf rtf doc docx xls xlsx ppt pptx odt ods odp xml csv diff patch swf md textile vtt webvtt';
        /**
         * This is the version of the H5P Core (JS + CSS) that is used by this implementation.
         * It is sent to the H5P Hub when registering there.
         * Not user-configurable and should not be changed by custom implementations.
         */
        this.coreApiVersion = {
            major: 1,
            minor: 24
        };
        /**
         * If set to true, the content types that require a Learning Record Store to make sense are
         * offered as a choice when the user creates new content.
         * User-configurable.
         */
        this.enableLrsContentTypes = true;
        /**
         * Unclear. Taken over from PHP implementation and sent to the H5P Hub when registering the site.
         * User-configurable.
         */
        this.fetchingDisabled = 0;
        /**
         * This is where the client will look for image, video etc. files added to content.
         * WARNING: Do not change the 'content' part of the URL, as the editor client assumes that it can find
         * content under this path!
         */
        this.filesPath = '/html5client/h5p/content';
        /**
         * This is the version of the PHP implementation that the NodeJS implementation imitates.
         * It is sent to the H5P Hub when registering there.
         * Not user-configurable and should not be changed by custom implementations.
         */
        this.h5pVersion = '1.24.0';
        /**
         * Called to fetch information about the content types available at the H5P Hub.
         * User-configurable.
         */
        this.hubContentTypesEndpoint = 'https://api.h5p.org/v1/content-types/';
        /**
         * Called to register the running instance at the H5P Hub.
         * User-configurable.
         */
        this.hubRegistrationEndpoint = 'https://api.h5p.org/v1/sites';
        /**
         * The EDITOR LIBRARY FILES are loaded from here (needed for the ckeditor), NOT
         * the libraries itself.
         */
        this.libraryUrl = '/html5client/h5p/editor/';
        /**
         * A list of file extensions allowed for library files.
         * (All extensions allowed for content files are also automatically allowed for libraries).
         */
        this.libraryWhitelist = 'js css';
        /**
         * The list of content types that are enabled when enableLrsContentTypes is set to true.
         * Not user-configurable.
         */
        this.lrsContentTypes = [
            'H5P.Questionnaire',
            'H5P.FreeTextQuestion'
        ];
        /**
         * The maximum allowed file size of content and library files (in bytes).
         */
        this.maxFileSize = 16 * 1024 * 1024;
        /**
         * The maximum allowed file size of all content and library files in an uploaded h5p package (in bytes).
         */
        this.maxTotalSize = 64 * 1024 * 1024;
        /**
         * This is the name of the H5P implementation sent to the H5P for statistical reasons.
         * Not user-configurable but should be overridden by custom custom implementations.
         */
        this.platformName = 'H5P-Editor-NodeJs';
        /**
         * This is the version of the H5P implementation sent to the H5P when registering the site.
         * Not user-configurable but should be overridden by custom custom implementations.
         */
        this.platformVersion = '0.1';
        /**
         * If true, the instance will send usage statistics to the H5P Hub whenever it looks for new content types or updates.
         * User-configurable.
         */
        this.sendUsageStatistics = false;
        /**
         * Indicates on what kind of network the site is running. Can be "local", "network" or "internet".
         * TODO: This value should not be user-configurable, but has to be determined by the system on startup.
         * (If possible.)
         */
        this.siteType = 'local';
        /**
         * Temporary files will be deleted after this time. (in milliseconds)
         */
        this.temporaryFileLifetime = 120 * 60 * 1000; // 120 minutes
        /**
         * The URL path of temporary file storage (used for image, video etc. uploads of
         * unsaved content).
         */
        this.temporaryFilesPath = '/h5p/temp-files';
        /**
         * Used to identify the running instance when calling the H5P Hub.
         * User-configurable, but also automatically set when the Hub is first called.
         */
        this.uuid = ''; // TODO: revert to''
        this.storage = storage;
    }
    /**
     * Loads all changeable settings from storage. (Should be called when the system initializes.)
     */
    EditorConfig.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettingFromStorage('fetchingDisabled')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('uuid')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('siteType')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('sendUsageStatistics')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('hubRegistrationEndpoint')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('hubContentTypesEndpoint')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentTypeCacheRefreshInterval')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('enableLrsContentTypes')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentWhitelist')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('libraryWhitelist')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('maxFileSize')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('maxTotalSize')];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Saves all changeable settings to storage. (Should be called when a setting was changed.)
     */
    EditorConfig.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveSettingToStorage('fetchingDisabled')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('uuid')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('siteType')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('sendUsageStatistics')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('hubRegistrationEndpoint')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('hubContentTypesEndpoint')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentTypeCacheRefreshInterval')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('enableLrsContentTypes')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentWhitelist')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('libraryWhitelist')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('maxFileSize')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('maxTotalSize')];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads a settings from the storage interface. Uses the default value configured in this file if there is none in the configuration.
     * @param settingName
     * @returns the value of the setting
     */
    EditorConfig.prototype.loadSettingFromStorage = function (settingName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        _b = settingName;
                        return [4 /*yield*/, this.storage.load(settingName)];
                    case 1:
                        _a[_b] =
                            (_c.sent()) || this[settingName];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves a setting to the storage interface.
     * @param settingName
     */
    EditorConfig.prototype.saveSettingToStorage = function (settingName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.save(settingName, this[settingName])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EditorConfig;
}());
exports["default"] = EditorConfig;
//# sourceMappingURL=EditorConfig.js.map