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
var glob_promise_1 = __importDefault(require("glob-promise"));
var path_1 = __importDefault(require("path"));
var promisepipe_1 = __importDefault(require("promisepipe"));
var src_1 = require("../../src");
/**
 * Persists content to the disk.
 */
var FileContentStorage = /** @class */ (function () {
    /**
     * @param {string} contentPath The absolute path to the directory where the content should be stored
     */
    function FileContentStorage(contentPath) {
        this.contentPath = contentPath;
    }
    /**
     * Returns a random integer
     * @param {number} min The minimum
     * @param {number} max The maximum
     * @returns {number} a random integer
     */
    FileContentStorage.getRandomInt = function (min, max) {
        var finalMin = Math.ceil(min);
        var finalMax = Math.floor(max);
        return Math.floor(Math.random() * (finalMax - finalMin + 1)) + finalMin;
    };
    /**
     * Adds a content file to an existing content object. The content object has to be created with createContent(...) first.
     * @param {ContentId} id The id of the content to add the file to
     * @param {string} filename The filename
     * @param {Stream} stream A readable stream that contains the data
     * @param {User} user The user who owns this object
     * @returns {Promise<void>}
     */
    FileContentStorage.prototype.addContentFile = function (id, filename, stream, user) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkFilename(filename);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(path_1["default"].join(this.contentPath, id.toString()))];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Cannot add file " + filename + " to content with id " + id + ": Content with this id does not exist.");
                        }
                        fullPath = path_1["default"].join(this.contentPath, id.toString(), filename);
                        return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].dirname(fullPath))];
                    case 2:
                        _a.sent();
                        writeStream = fs_extra_1["default"].createWriteStream(fullPath);
                        return [4 /*yield*/, promisepipe_1["default"](stream, writeStream)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if a piece of content exists in storage.
     * @param contentId the content id to check
     * @returns true if the piece of content exists
     */
    FileContentStorage.prototype.contentExists = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fs_extra_1["default"].pathExists(path_1["default"].join(this.contentPath, contentId.toString()))];
            });
        });
    };
    /**
     * Checks if a file exists.
     * @param contentId The id of the content to add the file to
     * @param filename the filename of the file to get
     * @returns true if the file exists
     */
    FileContentStorage.prototype.contentFileExists = function (contentId, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.checkFilename(filename);
                return [2 /*return*/, fs_extra_1["default"].pathExists(path_1["default"].join(this.contentPath, contentId.toString(), filename))];
            });
        });
    };
    /**
     * Creates a content object in the repository. Add files to it later with addContentFile(...).
     * Throws an error if something went wrong. In this case no traces of the content are left in storage and all changes are reverted.
     * @param {any} metadata The metadata of the content (= h5p.json)
     * @param {any} content the content object (= content/content.json)
     * @param {User} user The user who owns this object.
     * @param {ContentId} id (optional) The content id to use
     * @returns {Promise<ContentId>} The newly assigned content id
     */
    FileContentStorage.prototype.createContent = function (metadata, content, user, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id === undefined || id === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createContentId()];
                    case 1:
                        // tslint:disable-next-line: no-parameter-reassignment
                        id = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 8]);
                        return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].join(this.contentPath, id.toString()))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].writeJSON(path_1["default"].join(this.contentPath, id.toString(), 'h5p.json'), metadata)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].writeJSON(path_1["default"].join(this.contentPath, id.toString(), 'content.json'), content)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].remove(path_1["default"].join(this.contentPath, id.toString()))];
                    case 7:
                        _a.sent();
                        throw new Error("Could not create content: " + error_1.message);
                    case 8: return [2 /*return*/, id];
                }
            });
        });
    };
    /**
     * Generates a unique content id that hasn't been used in the system so far.
     * @returns {Promise<ContentId>} A unique content id
     */
    FileContentStorage.prototype.createContentId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var counter, id, exists, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        counter = 0;
                        exists = false;
                        _a.label = 1;
                    case 1:
                        id = FileContentStorage.getRandomInt(1, Math.pow(2, 32));
                        counter += 1;
                        p = path_1["default"].join(this.contentPath, id.toString());
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(p)];
                    case 2:
                        exists = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (exists && counter < 5) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        if (exists) {
                            throw new Error('Could not generate id for new content.');
                        }
                        return [2 /*return*/, id];
                }
            });
        });
    };
    /**
     * Deletes a content object and all its dependent files from the repository.
     * Throws errors if something goes wrong.
     * @param {ContentId} id The content id to delete.
     * @param {User} user The user who wants to delete the content
     * @returns {Promise<void>}
     */
    FileContentStorage.prototype.deleteContent = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].pathExists(path_1["default"].join(this.contentPath, id.toString()))];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Cannot delete content with id " + id + ": It does not exist.");
                        }
                        return [4 /*yield*/, fs_extra_1["default"].remove(path_1["default"].join(this.contentPath, id.toString()))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a file from a content object.
     * @param contentId the content object the file is attached to
     * @param filename the file to delete
     */
    FileContentStorage.prototype.deleteContentFile = function (contentId, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkFilename(filename);
                        absolutePath = path_1["default"].join(this.contentPath, contentId.toString(), filename);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(absolutePath)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Cannot delete file " + filename + " from content id " + contentId + ": It does not exist.");
                        }
                        return [4 /*yield*/, fs_extra_1["default"].remove(absolutePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the filenames of files added to the content with addContentFile(...) (e.g. images, videos or other files)
     * @param contentId the piece of content
     * @param user the user who wants to access the piece of content
     * @returns a list of files that are used in the piece of content, e.g. ['image1.png', 'video2.mp4']
     */
    FileContentStorage.prototype.getContentFiles = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var contentDirectoryPath, absolutePaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contentDirectoryPath = path_1["default"].join(this.contentPath, contentId.toString());
                        return [4 /*yield*/, glob_promise_1["default"](path_1["default"].join(contentDirectoryPath, '**', '*.*'), {
                                ignore: [
                                    path_1["default"].join(contentDirectoryPath, 'content.json'),
                                    path_1["default"].join(contentDirectoryPath, 'h5p.json')
                                ],
                                nodir: true
                            })];
                    case 1:
                        absolutePaths = _a.sent();
                        return [2 /*return*/, absolutePaths.map(function (p) { return path_1["default"].relative(contentDirectoryPath, p); })];
                }
            });
        });
    };
    /**
     * Returns a readable stream of a content file (e.g. image or video) inside a piece of content
     * @param {ContentId} id the id of the content object that the file is attached to
     * @param {string} filename the filename of the file to get
     * @param {User} user the user who wants to retrieve the content file
     * @returns {Stream}
     */
    FileContentStorage.prototype.getContentFileStream = function (id, filename, user) {
        this.checkFilename(filename);
        return fs_extra_1["default"].createReadStream(path_1["default"].join(this.contentPath, id.toString(), filename));
    };
    /**
     * Returns an array of permissions that the user has on the piece of content
     * @param contentId the content id to check
     * @param user the user who wants to access the piece of content
     * @returns the permissions the user has for this content (e.g. download it, delete it etc.)
     */
    FileContentStorage.prototype.getUserPermissions = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        src_1.Permission.Delete,
                        src_1.Permission.Download,
                        src_1.Permission.Edit,
                        src_1.Permission.Embed,
                        src_1.Permission.View
                    ]];
            });
        });
    };
    FileContentStorage.prototype.checkFilename = function (filename) {
        if (/\.\.\//.test(filename)) {
            throw new Error("Relative paths in filenames are not allowed: " + filename + " is illegal");
        }
        if (filename.startsWith('/')) {
            throw new Error("Absolute paths in filenames are not allowed: " + filename + " is illegal");
        }
    };
    return FileContentStorage;
}());
exports["default"] = FileContentStorage;
//# sourceMappingURL=FileContentStorage.js.map