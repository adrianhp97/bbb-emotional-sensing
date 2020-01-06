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
var src_1 = require("../../src");
/**
 * Stores temporary files in directories on the disk.
 * Manages access rights by creating one sub-directory for each user.
 * Manages expiration times by creating companion '.metadata' files for every
 * file stored.
 */
var DirectoryTemporaryFileStorage = /** @class */ (function () {
    /**
     * @param directory the directory in which the temporary files are stored.
     * Must be read- and write accessible
     */
    function DirectoryTemporaryFileStorage(directory) {
        this.directory = directory;
    }
    DirectoryTemporaryFileStorage.prototype.deleteFile = function (filename, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].remove(path_1["default"].join(this.directory, userId, filename))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].remove(path_1["default"].join(this.directory, userId, filename) + ".metadata")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].readdir(path_1["default"].join(this.directory, userId))];
                    case 3:
                        userFiles = _a.sent();
                        if (!(userFiles.length === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, fs_extra_1["default"].rmdir(path_1["default"].join(this.directory, userId))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DirectoryTemporaryFileStorage.prototype.fileExists = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            var absoluteFilename;
            return __generator(this, function (_a) {
                absoluteFilename = path_1["default"].join(this.directory, user.id, filename);
                return [2 /*return*/, fs_extra_1["default"].pathExists(absoluteFilename)];
            });
        });
    };
    DirectoryTemporaryFileStorage.prototype.getFileStream = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            var absoluteFilename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        absoluteFilename = path_1["default"].join(this.directory, user.id, filename);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(absoluteFilename)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new src_1.H5pError("The file " + filename + " is not accessible for user " + user.id + " or does not exist.");
                        }
                        return [2 /*return*/, fs_extra_1["default"].createReadStream(absoluteFilename)];
                }
            });
        });
    };
    DirectoryTemporaryFileStorage.prototype.listFiles = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var users, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!user) return [3 /*break*/, 1];
                        _a = [user.id];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, fs_extra_1["default"].readdir(this.directory)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        users = _a;
                        return [4 /*yield*/, Promise.all(users.map(function (u) { return __awaiter(_this, void 0, void 0, function () {
                                var filesOfUser;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fs_extra_1["default"].readdir(path_1["default"].join(this.directory, u))];
                                        case 1:
                                            filesOfUser = _a.sent();
                                            return [2 /*return*/, Promise.all(filesOfUser
                                                    .filter(function (f) { return !f.endsWith('.metadata'); })
                                                    .map(function (f) { return _this.getTemporaryFileInfo(f, u); }))];
                                    }
                                });
                            }); }))];
                    case 4: return [2 /*return*/, (_b.sent()).reduce(function (prev, curr) { return prev.concat(curr); }, [])];
                }
            });
        });
    };
    DirectoryTemporaryFileStorage.prototype.saveFile = function (filename, dataStream, user, expirationTime) {
        return __awaiter(this, void 0, void 0, function () {
            var absoluteFilename, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].join(this.directory, user.id))];
                    case 1:
                        _a.sent();
                        absoluteFilename = path_1["default"].join(this.directory, user.id, filename);
                        writeStream = fs_extra_1["default"].createWriteStream(absoluteFilename);
                        return [4 /*yield*/, promisepipe_1["default"](dataStream, writeStream)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].writeJSON(absoluteFilename + ".metadata", {
                                expiresAt: expirationTime.getTime()
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                expiresAt: expirationTime,
                                filename: filename,
                                ownedByUserId: user.id
                            }];
                }
            });
        });
    };
    DirectoryTemporaryFileStorage.prototype.getTemporaryFileInfo = function (filename, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].readJSON(path_1["default"].join(this.directory, userId, filename) + ".metadata")];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, {
                                expiresAt: new Date(metadata.expiresAt),
                                filename: filename,
                                ownedByUserId: userId
                            }];
                }
            });
        });
    };
    return DirectoryTemporaryFileStorage;
}());
exports["default"] = DirectoryTemporaryFileStorage;
//# sourceMappingURL=DirectoryTemporaryFileStorage.js.map