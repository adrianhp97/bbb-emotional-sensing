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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_extra_1 = __importDefault(require("fs-extra"));
var promisepipe_1 = __importDefault(require("promisepipe"));
var stream_1 = __importDefault(require("stream"));
var tmp_promise_1 = require("tmp-promise");
var default_editor_integration_json_1 = __importDefault(require("../assets/default_editor_integration.json"));
var en_json_1 = __importDefault(require("../assets/translations/en.json"));
var default_1 = __importDefault(require("./renderers/default"));
var ContentManager_1 = __importDefault(require("./ContentManager"));
var ContentMetadata_1 = require("./ContentMetadata");
var ContentStorer_1 = __importDefault(require("./ContentStorer"));
var ContentTypeCache_1 = __importDefault(require("./ContentTypeCache"));
var ContentTypeInformationRepository_1 = __importDefault(require("./ContentTypeInformationRepository"));
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var LibraryManager_1 = __importDefault(require("./LibraryManager"));
var LibraryName_1 = __importDefault(require("./LibraryName"));
var PackageExporter_1 = __importDefault(require("./PackageExporter"));
var PackageImporter_1 = __importDefault(require("./PackageImporter"));
var TemporaryFileManager_1 = __importDefault(require("./TemporaryFileManager"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('Editor');
var H5PEditor = /** @class */ (function () {
    function H5PEditor(keyValueStorage, config, libraryStorage, contentStorage, translationService, 
    /**
     * This function returns the (relative) URL at which a file inside a library
     * can be accessed. It is used when URLs of library files must be inserted
     * (hard-coded) into data structures. The implementation must do this file ->
     * URL resolution, as it decides where the files can be accessed.
     */
    libraryFileUrlResolver, temporaryStorage) {
        this.config = config;
        log.info('initialize');
        this.renderer = default_1["default"];
        this.baseUrl = config.baseUrl;
        this.translation = en_json_1["default"];
        this.ajaxPath = config.ajaxPath;
        this.libraryUrl = config.libraryUrl;
        this.filesPath = config.filesPath;
        this.contentTypeCache = new ContentTypeCache_1["default"](config, keyValueStorage);
        this.libraryManager = new LibraryManager_1["default"](libraryStorage, libraryFileUrlResolver);
        this.contentManager = new ContentManager_1["default"](contentStorage);
        this.contentTypeRepository = new ContentTypeInformationRepository_1["default"](this.contentTypeCache, keyValueStorage, this.libraryManager, config, translationService);
        this.translationService = translationService;
        this.config = config;
        this.temporaryFileManager = new TemporaryFileManager_1["default"](temporaryStorage, this.config);
        this.contentStorer = new ContentStorer_1["default"](this.contentManager, this.libraryManager, this.temporaryFileManager);
        this.packageImporter = new PackageImporter_1["default"](this.libraryManager, this.translationService, this.config, this.contentManager, this.contentStorer);
        this.packageExporter = new PackageExporter_1["default"](this.libraryManager, translationService, config, this.contentManager);
    }
    /**
     * Creates a .h5p-package for the specified content file and pipes it to the stream.
     * Throws H5pErrors if something goes wrong. The contents of the stream should be disregarded then.
     * @param contentId The contentId for which the package should be created.
     * @param outputStream The stream that the package is written to (e.g. the response stream fo Express)
     */
    H5PEditor.prototype.exportPackage = function (contentId, outputStream, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.packageExporter.createPackage(contentId, outputStream, user)];
            });
        });
    };
    /**
     * Returns a stream for a file that was uploaded for a content object.
     * The requested content file can be a temporary file uploaded for unsaved content or a
     * file in permanent content storage.
     * @param contentId the content id (undefined if retrieved for unsaved content)
     * @param filename the file to get (without 'content/' prefix!)
     * @param user the user who wants to retrieve the file
     * @returns a stream of the content file
     */
    H5PEditor.prototype.getContentFileStream = function (contentId, filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            var returnStream, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.contentManager.getContentFileStream(contentId, filename, user)];
                    case 1:
                        returnStream = _a.sent();
                        return [2 /*return*/, returnStream];
                    case 2:
                        error_1 = _a.sent();
                        log.debug("Couldn't find file " + filename + " in storage. Trying temporary storage.");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, this.temporaryFileManager.getFileStream(filename, user)];
                }
            });
        });
    };
    H5PEditor.prototype.getContentTypeCache = function (user) {
        log.info("getting content type cache");
        return this.contentTypeRepository.get(user);
    };
    H5PEditor.prototype.getLibraryData = function (machineName, majorVersion, minorVersion, language) {
        if (language === void 0) { language = 'en'; }
        return __awaiter(this, void 0, void 0, function () {
            var majorVersionAsNr, minorVersionAsNr, library, _a, assets, semantics, languageObject, languages, upgradeScriptPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("getting data for library " + machineName + "-" + majorVersion + "." + minorVersion);
                        majorVersionAsNr = Number.parseInt(majorVersion, 10);
                        minorVersionAsNr = Number.parseInt(minorVersion, 10);
                        library = new LibraryName_1["default"](machineName, majorVersionAsNr, minorVersionAsNr);
                        return [4 /*yield*/, this.libraryManager.libraryExists(library)];
                    case 1:
                        if (!(_b.sent())) {
                            throw new H5pError_1["default"]("Library " + LibraryName_1["default"].toUberName(library) + " was not found.");
                        }
                        return [4 /*yield*/, Promise.all([
                                this.loadAssets(machineName, majorVersionAsNr, minorVersionAsNr, language),
                                this.libraryManager.loadSemantics(library),
                                this.libraryManager.loadLanguage(library, language),
                                this.libraryManager.listLanguages(library),
                                this.libraryManager.getUpgradesScriptPath(library)
                            ])];
                    case 2:
                        _a = _b.sent(), assets = _a[0], semantics = _a[1], languageObject = _a[2], languages = _a[3], upgradeScriptPath = _a[4];
                        return [2 /*return*/, {
                                languages: languages,
                                semantics: semantics,
                                // tslint:disable-next-line: object-literal-sort-keys
                                css: assets.styles,
                                defaultLanguage: null,
                                language: languageObject,
                                name: machineName,
                                version: {
                                    major: majorVersionAsNr,
                                    minor: minorVersionAsNr
                                },
                                javascript: assets.scripts,
                                translations: assets.translations,
                                upgradesScript: upgradeScriptPath // we don't check whether the path is null, as we can retur null
                            }];
                }
            });
        });
    };
    /**
     * Retrieves the installed languages for libraries
     * @param libraryNames A list of libraries for which the language files should be retrieved.
     *                     In this list the names of the libraries don't use hyphens to separate
     *                     machine name and version.
     * @param language the language code to get the files for
     * @returns The strings of the language files
     */
    H5PEditor.prototype.getLibraryLanguageFiles = function (libraryNames, language) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("getting language files (" + language + ") for " + libraryNames.join(', '));
                        return [4 /*yield*/, Promise.all(libraryNames.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                                var lib, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            lib = LibraryName_1["default"].fromUberName(name, {
                                                useWhitespace: true
                                            });
                                            _a = {};
                                            return [4 /*yield*/, this.libraryManager.loadLanguage(lib, language)];
                                        case 1: return [2 /*return*/, (_a.languageJson = _b.sent(),
                                                _a.name = name,
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, (_a.sent()).reduce(function (builtObject, _a) {
                            var languageJson = _a.languageJson, name = _a.name;
                            if (languageJson) {
                                builtObject[name] = JSON.stringify(languageJson);
                            }
                            return builtObject;
                        }, {})];
                }
            });
        });
    };
    H5PEditor.prototype.getLibraryOverview = function (libraryNames) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("getting library overview for libraries: " + libraryNames.join(', '));
                        return [4 /*yield*/, Promise.all(libraryNames
                                .map(function (name) {
                                return LibraryName_1["default"].fromUberName(name, {
                                    useWhitespace: true
                                });
                            })
                                .filter(function (lib) { return lib !== undefined; }) // we filter out undefined values as Library.creatFromNames returns undefined for invalid names
                                .map(function (lib) { return __awaiter(_this, void 0, void 0, function () {
                                var loadedLibrary;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.libraryManager.loadLibrary(lib)];
                                        case 1:
                                            loadedLibrary = _a.sent();
                                            if (!loadedLibrary) {
                                                return [2 /*return*/, undefined];
                                            }
                                            return [2 /*return*/, {
                                                    majorVersion: loadedLibrary.majorVersion,
                                                    metadataSettings: null,
                                                    minorVersion: loadedLibrary.minorVersion,
                                                    name: loadedLibrary.machineName,
                                                    restricted: false,
                                                    runnable: loadedLibrary.runnable,
                                                    title: loadedLibrary.title,
                                                    tutorialUrl: '',
                                                    uberName: loadedLibrary.machineName + " " + loadedLibrary.majorVersion + "." + loadedLibrary.minorVersion
                                                }];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (lib) { return lib !== undefined; })]; // we filter out undefined values as the last map return undefined values if a library doesn't exist
                }
            });
        });
    };
    /**
     * Determines the main library and returns the ubername for it (e.g. "H5P.Example 1.0").
     * @param metadata the metadata object (=h5p.json)
     * @returns the ubername with a whitespace as separator
     */
    H5PEditor.prototype.getUbernameFromMetadata = function (metadata) {
        var library = (metadata.preloadedDependencies || []).find(function (dependency) { return dependency.machineName === metadata.mainLibrary; });
        if (!library) {
            return '';
        }
        return LibraryName_1["default"].toUberName(library, { useWhitespace: true });
    };
    /**
     * Installs a content type from the H5P Hub.
     * @param {string} id The name of the content type to install (e.g. H5P.Test-1.0)
     * @returns {Promise<true>} true if successful. Will throw errors if something goes wrong.
     */
    H5PEditor.prototype.installLibrary = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contentTypeRepository.install(id, user)];
            });
        });
    };
    H5PEditor.prototype.loadH5P = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, h5pJson, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("loading h5p for " + contentId);
                        return [4 /*yield*/, Promise.all([
                                this.contentManager.loadH5PJson(contentId, user),
                                this.contentManager.loadContent(contentId, user)
                            ])];
                    case 1:
                        _a = _b.sent(), h5pJson = _a[0], content = _a[1];
                        return [2 /*return*/, {
                                h5p: h5pJson,
                                library: this.getUbernameFromMetadata(h5pJson),
                                params: {
                                    metadata: h5pJson,
                                    params: content
                                }
                            }];
                }
            });
        });
    };
    H5PEditor.prototype.render = function (contentId) {
        log.info("rendering " + contentId);
        var model = {
            integration: this.integration(contentId),
            scripts: this.coreScripts(),
            styles: this.coreStyles()
        };
        return Promise.resolve(this.renderer(model));
    };
    /**
     * Stores an uploaded file in temporary storage.
     * @param contentId the id of the piece of content the file is attached to; Set to null/undefined if
     * the content hasn't been saved before.
     * @param field the semantic structure of the field the file is attached to.
     * @param file information about the uploaded file
     */
    H5PEditor.prototype.saveContentFile = function (contentId, field, file, user) {
        return __awaiter(this, void 0, void 0, function () {
            var dataStream, tmpFilename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataStream = new stream_1["default"].PassThrough();
                        dataStream.end(file.data);
                        log.info("Putting content file " + file.name + " into temporary storage");
                        return [4 /*yield*/, this.temporaryFileManager.saveFile(file.name, dataStream, user)];
                    case 1:
                        tmpFilename = _a.sent();
                        log.debug("New temporary filename is " + tmpFilename);
                        return [2 /*return*/, {
                                mime: file.mimetype,
                                path: tmpFilename + "#tmp"
                            }];
                }
            });
        });
    };
    /**
     * Stores new content or updates existing content.
     * Copies over files from temporary storage if necessary.
     * @param contentId the contentId of existing content (undefined or previously unsaved content)
     * @param parameters the content parameters (=content.json)
     * @param metadata the content metadata (~h5p.json)
     * @param mainLibraryName the ubername with whitespace as separator (no hyphen!)
     * @param user the user who wants to save the piece of content
     * @returns the existing contentId or the newly assigned one
     */
    H5PEditor.prototype.saveH5P = function (contentId, parameters, metadata, mainLibraryName, user) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedLibraryName, h5pJson, newContentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (contentId !== undefined) {
                            log.info("saving h5p content for " + contentId);
                        }
                        else {
                            log.info('saving new content');
                        }
                        try {
                            parsedLibraryName = LibraryName_1["default"].fromUberName(mainLibraryName, {
                                useWhitespace: true
                            });
                        }
                        catch (error) {
                            throw new H5pError_1["default"]("mainLibraryName is invalid: " + error.message);
                        }
                        return [4 /*yield*/, this.generateH5PJSON(metadata, parsedLibraryName, this.findLibraries(parameters))];
                    case 1:
                        h5pJson = _a.sent();
                        return [4 /*yield*/, this.contentStorer.saveOrUpdateContent(contentId, parameters, h5pJson, parsedLibraryName, user)];
                    case 2:
                        newContentId = _a.sent();
                        return [2 /*return*/, newContentId];
                }
            });
        });
    };
    H5PEditor.prototype.setAjaxPath = function (ajaxPath) {
        log.info("setting ajax path to " + ajaxPath);
        this.ajaxPath = ajaxPath;
        return this;
    };
    /**
     * Adds the contents of a package to the system: Installs required libraries (if
     * the user has the permissions for this), adds files to temporary storage and
     * returns the actual content information for the editor to process.
     * Throws errors if something goes wrong.
     * @param data the raw data of the h5p package as a buffer
     * @returns the content information extracted from the package
     */
    H5PEditor.prototype.uploadPackage = function (data, user) {
        return __awaiter(this, void 0, void 0, function () {
            var dataStream, returnValues;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("uploading package");
                        dataStream = new stream_1["default"].PassThrough();
                        dataStream.end(data);
                        return [4 /*yield*/, tmp_promise_1.withFile(function (_a) {
                                var tempPackagePath = _a.path;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var writeStream, error_2;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                writeStream = fs_extra_1["default"].createWriteStream(tempPackagePath);
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, promisepipe_1["default"](dataStream, writeStream)];
                                            case 2:
                                                _b.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_2 = _b.sent();
                                                throw new H5pError_1["default"](this.translationService.getTranslation('upload-package-failed-tmp'));
                                            case 4: return [4 /*yield*/, this.packageImporter.addPackageLibrariesAndTemporaryFiles(tempPackagePath, user)];
                                            case 5:
                                                returnValues = _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }, { postfix: '.h5p', keep: false })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, returnValues];
                }
            });
        });
    };
    H5PEditor.prototype.useRenderer = function (renderer) {
        this.renderer = renderer;
        return this;
    };
    H5PEditor.prototype.coreScripts = function () {
        var _this = this;
        return [
            '/core/js/jquery.js',
            '/core/js/h5p.js',
            '/core/js/h5p-event-dispatcher.js',
            '/core/js/h5p-x-api-event.js',
            '/core/js/h5p-x-api.js',
            '/core/js/h5p-content-type.js',
            '/core/js/h5p-confirmation-dialog.js',
            '/core/js/h5p-action-bar.js',
            '/editor/scripts/h5p-hub-client.js',
            '/editor/scripts/h5peditor-editor.js',
            '/editor/scripts/h5peditor.js',
            '/editor/scripts/h5peditor-semantic-structure.js',
            '/editor/scripts/h5peditor-library-selector.js',
            '/editor/scripts/h5peditor-form.js',
            '/editor/scripts/h5peditor-text.js',
            '/editor/scripts/h5peditor-html.js',
            '/editor/scripts/h5peditor-number.js',
            '/editor/scripts/h5peditor-textarea.js',
            '/editor/scripts/h5peditor-file-uploader.js',
            '/editor/scripts/h5peditor-file.js',
            '/editor/scripts/h5peditor-image.js',
            '/editor/scripts/h5peditor-image-popup.js',
            '/editor/scripts/h5peditor-av.js',
            '/editor/scripts/h5peditor-group.js',
            '/editor/scripts/h5peditor-boolean.js',
            '/editor/scripts/h5peditor-list.js',
            '/editor/scripts/h5peditor-list-editor.js',
            '/editor/scripts/h5peditor-library.js',
            '/editor/scripts/h5peditor-library-list-cache.js',
            '/editor/scripts/h5peditor-select.js',
            '/editor/scripts/h5peditor-selector-hub.js',
            '/editor/scripts/h5peditor-selector-legacy.js',
            '/editor/scripts/h5peditor-dimensions.js',
            '/editor/scripts/h5peditor-coordinates.js',
            '/editor/scripts/h5peditor-none.js',
            '/editor/scripts/h5peditor-metadata.js',
            '/editor/scripts/h5peditor-metadata-author-widget.js',
            '/editor/scripts/h5peditor-metadata-changelog-widget.js',
            '/editor/scripts/h5peditor-pre-save.js',
            '/editor/ckeditor/ckeditor.js'
        ].map(function (file) { return "" + _this.baseUrl + file; });
    };
    H5PEditor.prototype.coreStyles = function () {
        var _this = this;
        return [
            '/core/styles/h5p.css',
            '/core/styles/h5p-confirmation-dialog.css',
            '/core/styles/h5p-core-button.css',
            '/editor/libs/darkroom.css',
            '/editor/styles/css/h5p-hub-client.css',
            '/editor/styles/css/fonts.css',
            '/editor/styles/css/application.css',
            '/editor/styles/css/libs/zebra_datepicker.min.css'
        ].map(function (file) { return "" + _this.baseUrl + file; });
    };
    H5PEditor.prototype.editorIntegration = function (contentId) {
        var _this = this;
        log.info("generating integration for " + contentId);
        return __assign(__assign({}, default_editor_integration_json_1["default"]), { ajaxPath: this.ajaxPath, apiVersion: {
                majorVersion: this.config.coreApiVersion.major,
                minorVersion: this.config.coreApiVersion.minor
            }, assets: {
                css: [
                    '/core/styles/h5p.css',
                    '/core/styles/h5p-confirmation-dialog.css',
                    '/core/styles/h5p-core-button.css',
                    '/editor/libs/darkroom.css',
                    '/editor/styles/css/h5p-hub-client.css',
                    '/editor/styles/css/fonts.css',
                    '/editor/styles/css/application.css',
                    '/editor/styles/css/libs/zebra_datepicker.min.css'
                ].map(function (asset) { return "" + _this.baseUrl + asset; }),
                js: [
                    '/core/js/jquery.js',
                    '/core/js/h5p.js',
                    '/core/js/h5p-event-dispatcher.js',
                    '/core/js/h5p-x-api-event.js',
                    '/core/js/h5p-x-api.js',
                    '/core/js/h5p-content-type.js',
                    '/core/js/h5p-confirmation-dialog.js',
                    '/core/js/h5p-action-bar.js',
                    '/editor/scripts/h5p-hub-client.js',
                    '/editor/scripts/h5peditor.js',
                    '/editor/language/en.js',
                    '/editor/scripts/h5peditor-semantic-structure.js',
                    '/editor/scripts/h5peditor-library-selector.js',
                    '/editor/scripts/h5peditor-form.js',
                    '/editor/scripts/h5peditor-text.js',
                    '/editor/scripts/h5peditor-html.js',
                    '/editor/scripts/h5peditor-number.js',
                    '/editor/scripts/h5peditor-textarea.js',
                    '/editor/scripts/h5peditor-file-uploader.js',
                    '/editor/scripts/h5peditor-file.js',
                    '/editor/scripts/h5peditor-image.js',
                    '/editor/scripts/h5peditor-image-popup.js',
                    '/editor/scripts/h5peditor-av.js',
                    '/editor/scripts/h5peditor-group.js',
                    '/editor/scripts/h5peditor-boolean.js',
                    '/editor/scripts/h5peditor-list.js',
                    '/editor/scripts/h5peditor-list-editor.js',
                    '/editor/scripts/h5peditor-library.js',
                    '/editor/scripts/h5peditor-library-list-cache.js',
                    '/editor/scripts/h5peditor-select.js',
                    '/editor/scripts/h5peditor-selector-hub.js',
                    '/editor/scripts/h5peditor-selector-legacy.js',
                    '/editor/scripts/h5peditor-dimensions.js',
                    '/editor/scripts/h5peditor-coordinates.js',
                    '/editor/scripts/h5peditor-none.js',
                    '/editor/scripts/h5peditor-metadata.js',
                    '/editor/scripts/h5peditor-metadata-author-widget.js',
                    '/editor/scripts/h5peditor-metadata-changelog-widget.js',
                    '/editor/scripts/h5peditor-pre-save.js',
                    '/editor/ckeditor/ckeditor.js'
                ].map(function (asset) { return "" + _this.baseUrl + asset; })
            }, filesPath: this.config.temporaryFilesPath, libraryUrl: this.libraryUrl, nodeVersionId: contentId });
    };
    H5PEditor.prototype.findLibraries = function (object, collect) {
        var _this = this;
        if (collect === void 0) { collect = {}; }
        if (typeof object !== 'object') {
            return collect;
        }
        Object.keys(object).forEach(function (key) {
            if (key === 'library' && typeof object[key] === 'string') {
                if (object[key].match(/.+ \d+\.\d+/)) {
                    collect[object[key]] = LibraryName_1["default"].fromUberName(object[key], { useWhitespace: true });
                }
            }
            else {
                _this.findLibraries(object[key], collect);
            }
        });
        return Object.values(collect);
    };
    H5PEditor.prototype.generateH5PJSON = function (metadata, libraryName, contentDependencies) {
        if (contentDependencies === void 0) { contentDependencies = []; }
        return __awaiter(this, void 0, void 0, function () {
            var library, h5pJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("generating h5p.json");
                        return [4 /*yield*/, this.libraryManager.loadLibrary(libraryName)];
                    case 1:
                        library = _a.sent();
                        h5pJson = new ContentMetadata_1.ContentMetadata(metadata, { mainLibrary: library.machineName }, {
                            preloadedDependencies: __spreadArrays(contentDependencies, (library.preloadedDependencies || []), [
                                {
                                    machineName: library.machineName,
                                    majorVersion: library.majorVersion,
                                    minorVersion: library.minorVersion
                                }
                            ])
                        });
                        return [2 /*return*/, h5pJson];
                }
            });
        });
    };
    H5PEditor.prototype.integration = function (contentId) {
        return {
            ajax: {
                contentUserData: '',
                setFinished: ''
            },
            ajaxPath: this.ajaxPath,
            editor: this.editorIntegration(contentId),
            hubIsEnabled: true,
            l10n: {
                H5P: this.translation
            },
            postUserStatistics: false,
            saveFreq: false,
            url: this.baseUrl,
            user: {
                mail: '',
                name: ''
            }
        };
    };
    H5PEditor.prototype.loadAssets = function (machineName, majorVersion, minorVersion, language, loaded) {
        var _this = this;
        if (loaded === void 0) { loaded = {}; }
        var key = machineName + "-" + majorVersion + "." + minorVersion;
        var path = this.baseUrl + "/libraries/" + key;
        if (key in loaded)
            return Promise.resolve(null);
        loaded[key] = true;
        var assets = {
            scripts: [],
            styles: [],
            translations: {}
        };
        var lib = new LibraryName_1["default"](machineName, majorVersion, minorVersion);
        return Promise.all([
            this.libraryManager.loadLibrary(lib),
            this.libraryManager.loadLanguage(lib, language || 'en')
        ])
            .then(function (_a) {
            var library = _a[0], translation = _a[1];
            return Promise.all([
                _this.resolveDependencies(library.preloadedDependencies || [], language, loaded),
                _this.resolveDependencies(library.editorDependencies || [], language, loaded)
            ]).then(function (combinedDependencies) {
                combinedDependencies.forEach(function (dependencies) {
                    return dependencies.forEach(function (dependency) {
                        dependency.scripts.forEach(function (script) {
                            return assets.scripts.push(script);
                        });
                        dependency.styles.forEach(function (script) {
                            return assets.styles.push(script);
                        });
                        Object.keys(dependency.translations).forEach(function (k) {
                            assets.translations[k] =
                                dependency.translations[k];
                        });
                    });
                });
                (library.preloadedJs || []).forEach(function (script) {
                    return assets.scripts.push(path + "/" + script.path);
                });
                (library.preloadedCss || []).forEach(function (style) {
                    return assets.styles.push(path + "/" + style.path);
                });
                assets.translations[machineName] = translation || undefined;
            });
        })
            .then(function () { return assets; });
    };
    H5PEditor.prototype.resolveDependencies = function (originalDependencies, language, loaded) {
        var _this = this;
        var dependencies = originalDependencies.slice();
        var resolved = [];
        var resolve = function (dependency) {
            if (!dependency)
                return Promise.resolve(resolved);
            return _this.loadAssets(dependency.machineName, dependency.majorVersion, dependency.minorVersion, language, loaded)
                .then(function (assets) {
                return assets ? resolved.push(assets) : null;
            })
                .then(function () { return resolve(dependencies.shift()); });
        };
        return resolve(dependencies.shift());
    };
    return H5PEditor;
}());
exports["default"] = H5PEditor;
//# sourceMappingURL=H5PEditor.js.map