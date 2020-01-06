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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var body_parser_1 = __importDefault(require("body-parser"));
var child_process_1 = __importDefault(require("child_process"));
var express_1 = __importDefault(require("express"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = __importDefault(require("util"));
var exec = util_1["default"].promisify(child_process_1["default"].exec);
var index_1 = __importDefault(require("./index"));
var h5pLib = __importStar(require("../src"));
var DirectoryTemporaryFileStorage_1 = __importDefault(require("./implementation/DirectoryTemporaryFileStorage"));
var EditorConfig_1 = __importDefault(require("./implementation/EditorConfig"));
var FileContentStorage_1 = __importDefault(require("./implementation/FileContentStorage"));
var FileLibraryStorage_1 = __importDefault(require("./implementation/FileLibraryStorage"));
var InMemoryStorage_1 = __importDefault(require("./implementation/InMemoryStorage"));
var JsonStorage_1 = __importDefault(require("./implementation/JsonStorage"));
var User_1 = __importDefault(require("./implementation/User"));
var examples_json_1 = __importDefault(require("./examples.json"));
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var h5pEditor, _a, _b, _c, user, server, h5pRoute;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = h5pLib.H5PEditor).bind;
                _c = [void 0, new InMemoryStorage_1["default"]()];
                return [4 /*yield*/, new EditorConfig_1["default"](new JsonStorage_1["default"](path_1["default"].resolve('examples/config.json'))).load()];
            case 1:
                h5pEditor = new (_b.apply(_a, _c.concat([_d.sent(),
                    new FileLibraryStorage_1["default"](path_1["default"].resolve('h5p/libraries')),
                    new FileContentStorage_1["default"](path_1["default"].resolve('h5p/content')),
                    new h5pLib.TranslationService(h5pLib.englishStrings),
                    function (library, file) {
                        return h5pRoute + "/libraries/" + library.machineName + "-" + library.majorVersion + "." + library.minorVersion + "/" + file;
                    },
                    new DirectoryTemporaryFileStorage_1["default"](path_1["default"].resolve('h5p/temporary-storage'))])))();
                user = new User_1["default"]();
                server = express_1["default"]();
                server.use(body_parser_1["default"].json());
                server.use(body_parser_1["default"].urlencoded({
                    extended: true
                }));
                server.use(express_fileupload_1["default"]({
                    limits: { fileSize: 50 * 1024 * 1024 }
                }));
                h5pRoute = '/h5p';
                server.get(h5pRoute + "/libraries/:uberName/:file(*)", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var stream;
                    return __generator(this, function (_a) {
                        stream = h5pEditor.libraryManager.getFileStream(h5pLib.LibraryName.fromUberName(req.params.uberName), req.params.file);
                        stream.on('end', function () {
                            res.end();
                        });
                        stream.pipe(res.type(path_1["default"].basename(req.params.file)));
                        return [2 /*return*/];
                    });
                }); });
                server.get(h5pRoute + "/content/:id/:file(*)", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var stream;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, h5pEditor.getContentFileStream(req.params.id, req.params.file, user)];
                            case 1:
                                stream = _a.sent();
                                stream.on('end', function () {
                                    res.end();
                                    stream.close();
                                });
                                stream.pipe(res.type(path_1["default"].basename(req.params.file)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                server.get(h5pEditor.config.temporaryFilesPath + "/:file(*)", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var stream;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, h5pEditor.getContentFileStream(undefined, req.params.file, user)];
                            case 1:
                                stream = _a.sent();
                                stream.on('end', function () {
                                    res.end();
                                    stream.close();
                                });
                                stream.pipe(res.type(path_1["default"].basename(req.params.file)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                server.use(h5pRoute, express_1["default"].static(path_1["default"].resolve('') + "/h5p"));
                server.use('/favicon.ico', express_1["default"].static("favicon.ico"));
                server.get('/', function (req, res) {
                    fs_1["default"].readdir('h5p/content', function (error, files) {
                        res.end(index_1["default"]({ contentIds: error ? [] : files, examples: examples_json_1["default"] }));
                    });
                });
                server.get('/play', function (req, res) {
                    if (!req.query.contentId) {
                        return res.redirect('/');
                    }
                    var libraryLoader = function (lib, maj, min) {
                        return h5pEditor.libraryManager.loadLibrary(new h5pLib.LibraryName(lib, maj, min));
                    };
                    Promise.all([
                        h5pEditor.contentManager.loadContent(req.query.contentId, new User_1["default"]()),
                        h5pEditor.contentManager.loadH5PJson(req.query.contentId, new User_1["default"]())
                    ]).then(function (_a) {
                        var contentObject = _a[0], h5pObject = _a[1];
                        return new h5pLib.H5PPlayer(libraryLoader, {}, null, null, null)
                            .render(req.query.contentId, contentObject, h5pObject)
                            .then(function (h5pPage) { return res.end(h5pPage); })["catch"](function (error) { return res.status(500).end(error.message); });
                    });
                });
                server.get('/download', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!req.query.contentId) {
                                    return [2 /*return*/, res.redirect('/')];
                                }
                                // set filename for the package with .h5p extension
                                res.setHeader('Content-disposition', "attachment; filename=" + req.query.contentId + ".h5p");
                                return [4 /*yield*/, h5pEditor.exportPackage(req.query.contentId, res, user)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                server.get('/examples/:key', function (req, res) {
                    var key = req.params.key;
                    var name = path_1["default"].basename(examples_json_1["default"][key].h5p);
                    var tempPath = path_1["default"].resolve('scripts/tmp');
                    var tempFilename = path_1["default"].join(tempPath, name);
                    var libraryLoader = function (lib, maj, min) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, h5pEditor.libraryManager.loadLibrary(new h5pLib.LibraryName(lib, maj, min))];
                        });
                    }); };
                    exec("sh scripts/download-example.sh " + examples_json_1["default"][key].h5p)
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var contentId, h5pObject, contentObject;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, h5pEditor.packageImporter.addPackageLibrariesAndContent(tempFilename, new User_1["default"]())];
                                case 1:
                                    contentId = (_a.sent()).id;
                                    return [4 /*yield*/, h5pEditor.contentManager.loadH5PJson(contentId, new User_1["default"]())];
                                case 2:
                                    h5pObject = _a.sent();
                                    return [4 /*yield*/, h5pEditor.contentManager.loadContent(contentId, new User_1["default"]())];
                                case 3:
                                    contentObject = _a.sent();
                                    return [2 /*return*/, new h5pLib.H5PPlayer(libraryLoader, {}, null, null, '').render(contentId, contentObject, h5pObject)];
                            }
                        });
                    }); })
                        .then(function (h5pPage) { return res.end(h5pPage); })["catch"](function (error) { return res.status(500).end(error.message); })["finally"](function () {
                        fs_1["default"].unlinkSync(tempFilename);
                        fs_1["default"].rmdirSync(tempPath);
                    });
                });
                server.get('/edit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        h5pEditor.render(req.query.contentId).then(function (page) { return res.end(page); });
                        return [2 /*return*/];
                    });
                }); });
                server.get('/params', function (req, res) {
                    h5pEditor
                        .loadH5P(req.query.contentId)
                        .then(function (content) {
                        res.status(200).json(content);
                    })["catch"](function () {
                        res.status(404).end();
                    });
                });
                server.get('/ajax', function (req, res) {
                    var action = req.query.action;
                    var _a = req.query, majorVersion = _a.majorVersion, minorVersion = _a.minorVersion, machineName = _a.machineName, language = _a.language;
                    switch (action) {
                        case 'content-type-cache':
                            h5pEditor.getContentTypeCache(user).then(function (contentTypeCache) {
                                res.status(200).json(contentTypeCache);
                            });
                            break;
                        case 'libraries':
                            h5pEditor
                                .getLibraryData(machineName, majorVersion, minorVersion, language)
                                .then(function (library) {
                                res.status(200).json(library);
                            });
                            break;
                        default:
                            res.status(400).end();
                            break;
                    }
                });
                server.post('/edit', function (req, res) {
                    h5pEditor
                        .saveH5P(req.query.contentId, req.body.params.params, req.body.params.metadata, req.body.library, user)
                        .then(function () {
                        res.status(200).end();
                    });
                });
                server.post('/ajax', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var action, _a, libraryOverview, translationsResponse, uploadFileResponse, contentTypeCache, _b, metadata, parameters, contentTypes;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                action = req.query.action;
                                _a = action;
                                switch (_a) {
                                    case 'libraries': return [3 /*break*/, 1];
                                    case 'translations': return [3 /*break*/, 3];
                                    case 'files': return [3 /*break*/, 5];
                                    case 'library-install': return [3 /*break*/, 7];
                                    case 'library-upload': return [3 /*break*/, 10];
                                    case 'filter': return [3 /*break*/, 13];
                                }
                                return [3 /*break*/, 14];
                            case 1: return [4 /*yield*/, h5pEditor.getLibraryOverview(req.body.libraries)];
                            case 2:
                                libraryOverview = _c.sent();
                                res.status(200).json(libraryOverview);
                                return [3 /*break*/, 15];
                            case 3: return [4 /*yield*/, h5pEditor.getLibraryLanguageFiles(req.body.libraries, req.query.language)];
                            case 4:
                                translationsResponse = _c.sent();
                                res.status(200).json({
                                    data: translationsResponse,
                                    success: true
                                });
                                return [3 /*break*/, 15];
                            case 5: return [4 /*yield*/, h5pEditor.saveContentFile(req.body.contentId === '0'
                                    ? req.query.contentId
                                    : req.body.contentId, JSON.parse(req.body.field), req.files.file, user)];
                            case 6:
                                uploadFileResponse = _c.sent();
                                res.status(200).json(uploadFileResponse);
                                return [3 /*break*/, 15];
                            case 7: return [4 /*yield*/, h5pEditor.installLibrary(req.query.id, user)];
                            case 8:
                                _c.sent();
                                return [4 /*yield*/, h5pEditor.getContentTypeCache(user)];
                            case 9:
                                contentTypeCache = _c.sent();
                                res.status(200).json({
                                    data: contentTypeCache,
                                    success: true
                                });
                                return [3 /*break*/, 15];
                            case 10: return [4 /*yield*/, h5pEditor.uploadPackage(req.files.h5p.data, user)];
                            case 11:
                                _b = _c.sent(), metadata = _b.metadata, parameters = _b.parameters;
                                return [4 /*yield*/, h5pEditor.getContentTypeCache(user)];
                            case 12:
                                contentTypes = _c.sent();
                                res.status(200).json({
                                    data: {
                                        content: parameters,
                                        contentTypes: contentTypes,
                                        h5p: metadata
                                    },
                                    success: true
                                });
                                return [3 /*break*/, 15];
                            case 13:
                                res.status(200).json({
                                    data: JSON.parse(req.body.libraryParameters),
                                    success: true
                                });
                                return [3 /*break*/, 15];
                            case 14:
                                res.status(500).end('NOT IMPLEMENTED');
                                return [3 /*break*/, 15];
                            case 15: return [2 /*return*/];
                        }
                    });
                }); });
                server.listen(process.env.PORT || 8080);
                return [2 /*return*/];
        }
    });
}); };
start();
//# sourceMappingURL=express.js.map