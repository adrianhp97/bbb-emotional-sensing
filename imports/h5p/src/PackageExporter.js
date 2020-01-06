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
var stream_1 = require("stream");
var yazl_1 = __importDefault(require("yazl"));
var DependencyGetter_1 = __importDefault(require("./DependencyGetter"));
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var LibraryName_1 = __importDefault(require("./LibraryName"));
var types_1 = require("./types");
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('PackageExporter');
/**
 * Offers functionality to create .h5p files from content that is stored in the system.
 */
var PackageExporter = /** @class */ (function () {
    /**
     * @param {LibraryManager} libraryManager
     * @param {TranslationService} translationService
     * @param {EditorConfig} config
     * @param {ContentManager} contentManager (optional) Only needed if you want to use the PackageExporter to copy content from a package (e.g. Upload option in the editor)
     */
    function PackageExporter(libraryManager, translationService, config, contentManager) {
        if (contentManager === void 0) { contentManager = null; }
        this.libraryManager = libraryManager;
        this.translationService = translationService;
        this.config = config;
        this.contentManager = contentManager;
        log.info("initialize");
    }
    /**
     * Creates a .h5p-package for the specified content file and pipes it to the stream.
     * Throws H5pErrors if something goes wrong. The contents of the stream should be disregarded then.
     * @param contentId The contentId for which the package should be created.
     * @param outputStream The stream that the package is written to (e.g. the response stream fo Express)
     */
    PackageExporter.prototype.createPackage = function (contentId, outputStream, user) {
        return __awaiter(this, void 0, void 0, function () {
            var outputZipFile, contentStream, _a, metadata, metadataStream;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("creating package for " + contentId);
                        return [4 /*yield*/, this.checkAccess(contentId, user)];
                    case 1:
                        _b.sent();
                        outputZipFile = new yazl_1["default"].ZipFile();
                        outputZipFile.outputStream.pipe(outputStream);
                        return [4 /*yield*/, this.createContentFileStream(contentId, user)];
                    case 2:
                        contentStream = _b.sent();
                        outputZipFile.addReadStream(contentStream, 'content/content.json');
                        return [4 /*yield*/, this.getMetadata(contentId, user)];
                    case 3:
                        _a = _b.sent(), metadata = _a.metadata, metadataStream = _a.metadataStream;
                        outputZipFile.addReadStream(metadataStream, 'h5p.json');
                        // add content file (= files in content directory)
                        return [4 /*yield*/, this.addContentFiles(contentId, user, outputZipFile)];
                    case 4:
                        // add content file (= files in content directory)
                        _b.sent();
                        // add library files
                        return [4 /*yield*/, this.addLibraryFiles(metadata, outputZipFile)];
                    case 5:
                        // add library files
                        _b.sent();
                        // signal the end of zip creation
                        outputZipFile.end();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds the files inside the content directory to the zip file. Does not include content.json!
     */
    PackageExporter.prototype.addContentFiles = function (contentId, user, outputZipFile) {
        return __awaiter(this, void 0, void 0, function () {
            var contentFiles, _i, contentFiles_1, contentFile, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        log.info("adding content files to " + contentId);
                        return [4 /*yield*/, this.contentManager.getContentFiles(contentId, user)];
                    case 1:
                        contentFiles = _c.sent();
                        _i = 0, contentFiles_1 = contentFiles;
                        _c.label = 2;
                    case 2:
                        if (!(_i < contentFiles_1.length)) return [3 /*break*/, 5];
                        contentFile = contentFiles_1[_i];
                        _b = (_a = outputZipFile).addReadStream;
                        return [4 /*yield*/, this.contentManager.getContentFileStream(contentId, contentFile, user)];
                    case 3:
                        _b.apply(_a, [_c.sent(),
                            "content/" + contentFile]);
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds the library files to the zip file that are required for the content to be playable.
     */
    PackageExporter.prototype.addLibraryFiles = function (metadata, outputZipFile) {
        return __awaiter(this, void 0, void 0, function () {
            var dependencyGetter, dependencies, _i, dependencies_1, dependency, files, _a, files_1, file;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("adding library files");
                        dependencyGetter = new DependencyGetter_1["default"](this.libraryManager);
                        return [4 /*yield*/, dependencyGetter.getDependentLibraries(metadata.preloadedDependencies
                                .concat(metadata.editorDependencies || [])
                                .concat(metadata.dynamicDependencies || []), { editor: true, preloaded: true })];
                    case 1:
                        dependencies = _b.sent();
                        _i = 0, dependencies_1 = dependencies;
                        _b.label = 2;
                    case 2:
                        if (!(_i < dependencies_1.length)) return [3 /*break*/, 5];
                        dependency = dependencies_1[_i];
                        return [4 /*yield*/, this.libraryManager.listFiles(dependency)];
                    case 3:
                        files = _b.sent();
                        for (_a = 0, files_1 = files; _a < files_1.length; _a++) {
                            file = files_1[_a];
                            outputZipFile.addReadStream(this.libraryManager.getFileStream(dependency, file), LibraryName_1["default"].toUberName(dependency) + "/" + file);
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if a piece of content exists and if the user has download permissions for it.
     * Throws an exception with the respective error message if this is not the case.
     */
    PackageExporter.prototype.checkAccess = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentManager.contentExists(contentId)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new H5pError_1["default"]("Content can't be downloaded as no content with id " + contentId + " exists.");
                        }
                        return [4 /*yield*/, this.contentManager.getUserPermissions(contentId, user)];
                    case 2:
                        if (!(_a.sent()).some(function (p) { return p === types_1.Permission.Download; })) {
                            throw new H5pError_1["default"]("You do not have permission to download content with id " + contentId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a readable stream for the content.json file
     */
    PackageExporter.prototype.createContentFileStream = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var contentStream, content, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.contentManager.loadContent(contentId, user)];
                    case 1:
                        content = _a.sent();
                        contentStream = new stream_1.Readable();
                        contentStream._read = function () {
                            return;
                        };
                        contentStream.push(JSON.stringify(content));
                        contentStream.push(null);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new H5pError_1["default"]("Content can't be downloaded as the content data is unreadable.");
                    case 3: return [2 /*return*/, contentStream];
                }
            });
        });
    };
    /**
     * Gets the metadata for the piece of content (h5p.json) and also creates a file stream for it.
     */
    PackageExporter.prototype.getMetadata = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var metadataStream, metadata, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.contentManager.loadH5PJson(contentId, user)];
                    case 1:
                        metadata = _a.sent();
                        metadataStream = new stream_1.Readable();
                        metadataStream._read = function () {
                            return;
                        };
                        metadataStream.push(JSON.stringify(metadata));
                        metadataStream.push(null);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw new H5pError_1["default"]("Content can't be downloaded as the content metadata is unreadable.");
                    case 3: return [2 /*return*/, { metadata: metadata, metadataStream: metadataStream }];
                }
            });
        });
    };
    return PackageExporter;
}());
exports["default"] = PackageExporter;
//# sourceMappingURL=PackageExporter.js.map