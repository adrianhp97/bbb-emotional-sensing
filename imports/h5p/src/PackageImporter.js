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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var promisepipe_1 = __importDefault(require("promisepipe"));
var tmp_promise_1 = require("tmp-promise");
var yauzl_promise_1 = __importDefault(require("yauzl-promise"));
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var ValidationError_1 = __importDefault(require("./helpers/ValidationError"));
var PackageValidator_1 = __importDefault(require("./PackageValidator"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('PackageImporter');
/**
 * Indicates what to do with content.
 */
var ContentCopyModes;
(function (ContentCopyModes) {
    /**
     * "Install" means that the content should be permanently added to the system (i.e. added through ContentManager)
     */
    ContentCopyModes[ContentCopyModes["Install"] = 0] = "Install";
    /**
     * "Temporary" means that the content should not be permanently added to the system. Instead only the content files (images etc.)
     * are added to temporary storage.
     */
    ContentCopyModes[ContentCopyModes["Temporary"] = 1] = "Temporary";
    /**
     * "NoCopy" means that content is ignored.
     */
    ContentCopyModes[ContentCopyModes["NoCopy"] = 2] = "NoCopy";
})(ContentCopyModes || (ContentCopyModes = {}));
/**
 * Handles the installation of libraries and saving of content from a H5P package.
 */
var PackageImporter = /** @class */ (function () {
    /**
     * @param {LibraryManager} libraryManager
     * @param {TranslationService} translationService
     * @param {EditorConfig} config
     * @param {ContentStorer} contentStorer
     */
    function PackageImporter(libraryManager, translationService, config, contentManager, contentStorer) {
        if (contentManager === void 0) { contentManager = null; }
        if (contentStorer === void 0) { contentStorer = null; }
        this.libraryManager = libraryManager;
        this.translationService = translationService;
        this.config = config;
        this.contentManager = contentManager;
        this.contentStorer = contentStorer;
        log.info("initialize");
    }
    /**
     * Extracts a H5P package to the specified directory.
     * @param {string} packagePath The full path to the H5P package file on the local disk
     * @param {string} directoryPath The full path of the directory to which the package should be extracted
     * @param {boolean} includeLibraries If true, the library directories inside the package will be extracted.
     * @param {boolean} includeContent If true, the content folder inside the package will be extracted.
     * @param {boolean} includeMetadata If true, the h5p.json file inside the package will be extracted.
     * @returns {Promise<void>}
     */
    PackageImporter.extractPackage = function (packagePath, directoryPath, _a) {
        var _b = _a.includeLibraries, includeLibraries = _b === void 0 ? false : _b, _c = _a.includeContent, includeContent = _c === void 0 ? false : _c, _d = _a.includeMetadata, includeMetadata = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function () {
            var zipFile;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        log.info("extracting package " + packagePath + " to " + directoryPath);
                        return [4 /*yield*/, yauzl_promise_1["default"].open(packagePath)];
                    case 1:
                        zipFile = _e.sent();
                        return [4 /*yield*/, zipFile.walkEntries(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var basename, readStream, writePath, writeStream;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            basename = path_1["default"].basename(entry.fileName);
                                            if (!(!basename.startsWith('.') &&
                                                !basename.startsWith('_') &&
                                                ((includeContent && entry.fileName.startsWith('content/')) ||
                                                    (includeLibraries &&
                                                        entry.fileName.includes('/') &&
                                                        !entry.fileName.startsWith('content/')) ||
                                                    (includeMetadata && entry.fileName === 'h5p.json')))) return [3 /*break*/, 4];
                                            return [4 /*yield*/, entry.openReadStream()];
                                        case 1:
                                            readStream = _a.sent();
                                            writePath = path_1["default"].join(directoryPath, entry.fileName);
                                            return [4 /*yield*/, fs_extra_1["default"].mkdirp(path_1["default"].dirname(writePath))];
                                        case 2:
                                            _a.sent();
                                            writeStream = fs_extra_1["default"].createWriteStream(writePath);
                                            return [4 /*yield*/, promisepipe_1["default"](readStream, writeStream)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Permanently adds content from a H5P package to the system. This means that
     * content is __permanently__ added to storage and necessary libraries are installed from the package
     * if they are not already installed.
     *
     * This is __NOT__ what you want if the user is just uploading a package in the editor client!
     *
     * Throws errors if something goes wrong.
     * @param packagePath The full path to the H5P package file on the local disk.
     * @param user The user who wants to upload the package.
     * @param contentId (optional) the content id to use for the package
     * @returns the newly assigned content id, the metadata (=h5p.json) and parameters (=content.json)
     * inside the package
     */
    PackageImporter.prototype.addPackageLibrariesAndContent = function (packagePath, user, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, metadata, parameters;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("adding content from " + packagePath + " to system");
                        return [4 /*yield*/, this.processPackage(packagePath, {
                                copyMode: ContentCopyModes.Install,
                                installLibraries: user.canUpdateAndInstallLibraries
                            }, user, contentId)];
                    case 1:
                        _a = _b.sent(), id = _a.id, metadata = _a.metadata, parameters = _a.parameters;
                        if (id === undefined) {
                            throw new Error('Something went wrong when storing the package: no content id was assigned.');
                        }
                        return [2 /*return*/, { id: id, metadata: metadata, parameters: parameters }];
                }
            });
        });
    };
    /**
     * Copies files inside the package into temporary storage and installs the necessary libraries from the package
     * if they are not already installed. (This is what you want to do if the user uploads a package in the editor client.)
     * Pass the information returned about the content back to the editor client.
     * Throws errors if something goes wrong.
     * @param packagePath The full path to the H5P package file on the local disk.
     * @param user The user who wants to upload the package.
     * @returns the metadata and parameters inside the package
     */
    PackageImporter.prototype.addPackageLibrariesAndTemporaryFiles = function (packagePath, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.info("adding content from " + packagePath + " to system");
                return [2 /*return*/, this.processPackage(packagePath, {
                        copyMode: ContentCopyModes.Temporary,
                        installLibraries: user.canUpdateAndInstallLibraries
                    }, user)];
            });
        });
    };
    /**
     * Installs all libraries from the package. Assumes that the user calling this has the permission to install libraries!
     * Throws errors if something goes wrong.
     * @param {string} packagePath The full path to the H5P package file on the local disk.
     * @returns {Promise<void>}
     */
    PackageImporter.prototype.installLibrariesFromPackage = function (packagePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing libraries from package " + packagePath);
                        return [4 /*yield*/, this.processPackage(packagePath, {
                                copyMode: ContentCopyModes.NoCopy,
                                installLibraries: true
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generic method to process a H5P package. Can install libraries and copy content.
     * @param packagePath The full path to the H5P package file on the local disk
     * @param installLibraries If true, try installing libraries from package. Defaults to false.
     * @param copyMode indicates if and how content should be installed
     * @param user (optional) the user who wants to copy content (only needed when copying content)
     * @returns the newly assigned content id (undefined if not saved permanently), the metadata (=h5p.json)
     * and parameters (=content.json) inside the package
     */
    PackageImporter.prototype.processPackage = function (packagePath, _a, user, contentId) {
        var _b = _a.installLibraries, installLibraries = _b === void 0 ? false : _b, _c = _a.copyMode, copyMode = _c === void 0 ? ContentCopyModes.NoCopy : _c;
        return __awaiter(this, void 0, void 0, function () {
            var packageValidator, tempDirPath_1, dirContent, error_1, error_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        log.info("processing package " + packagePath);
                        packageValidator = new PackageValidator_1["default"](this.translationService, this.config);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 17, , 18]);
                        // no need to check result as the validator throws an exception if there is an error
                        return [4 /*yield*/, packageValidator.validatePackage(packagePath, false, true)];
                    case 2:
                        // no need to check result as the validator throws an exception if there is an error
                        _d.sent();
                        return [4 /*yield*/, tmp_promise_1.dir()];
                    case 3:
                        tempDirPath_1 = (_d.sent()).path;
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 13, 14, 16]);
                        return [4 /*yield*/, PackageImporter.extractPackage(packagePath, tempDirPath_1, {
                                includeContent: copyMode === ContentCopyModes.Install ||
                                    copyMode === ContentCopyModes.Temporary,
                                includeLibraries: installLibraries,
                                includeMetadata: copyMode === ContentCopyModes.Install ||
                                    copyMode === ContentCopyModes.Temporary
                            })];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, fs_extra_1["default"].readdir(tempDirPath_1)];
                    case 6:
                        dirContent = _d.sent();
                        if (!installLibraries) return [3 /*break*/, 8];
                        return [4 /*yield*/, Promise.all(dirContent
                                .filter(function (dirEntry) {
                                return dirEntry !== 'h5p.json' &&
                                    dirEntry !== 'content';
                            })
                                .map(function (dirEntry) {
                                return _this.libraryManager.installFromDirectory(path_1["default"].join(tempDirPath_1, dirEntry), false);
                            }))];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        if (!(copyMode === ContentCopyModes.Install)) return [3 /*break*/, 10];
                        if (!this.contentManager) {
                            throw new Error('PackageImporter was initialized without a ContentManager, but you want to copy content from a package. Pass a ContentManager object to the the constructor!');
                        }
                        return [4 /*yield*/, this.contentManager.copyContentFromDirectory(tempDirPath_1, user, contentId)];
                    case 9: return [2 /*return*/, _d.sent()];
                    case 10:
                        if (!(copyMode === ContentCopyModes.Temporary)) return [3 /*break*/, 12];
                        if (!this.contentStorer) {
                            throw new Error('PackageImporter was initialized without a ContentStorer, but you want to copy content from a package. Pass a ContentStorer object to the the constructor!');
                        }
                        return [4 /*yield*/, this.contentStorer.copyFromDirectoryToTemporary(tempDirPath_1, user)];
                    case 11: return [2 /*return*/, _d.sent()];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        error_1 = _d.sent();
                        // if we don't do this, finally weirdly just swallows the errors
                        throw error_1;
                    case 14: 
                    // clean up temporary files in any case
                    return [4 /*yield*/, fs_extra_1["default"].remove(tempDirPath_1)];
                    case 15:
                        // clean up temporary files in any case
                        _d.sent();
                        return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_2 = _d.sent();
                        if (error_2 instanceof ValidationError_1["default"]) {
                            throw new H5pError_1["default"](error_2.message); // TODO: create AJAX response?
                        }
                        else {
                            throw error_2;
                        }
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/, { id: undefined, metadata: undefined, parameters: undefined }];
                }
            });
        });
    };
    return PackageImporter;
}());
exports["default"] = PackageImporter;
//# sourceMappingURL=PackageImporter.js.map