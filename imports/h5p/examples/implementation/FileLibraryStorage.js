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
 * Stores libraries in a directory.
 */
var FileLibraryStorage = /** @class */ (function () {
    /**
     * @param {string} librariesDirectory The path of the directory in the file system at which libraries are stored.
     */
    function FileLibraryStorage(librariesDirectory) {
        this.librariesDirectory = librariesDirectory;
    }
    /**
     * Adds a library file to a library. The library metadata must have been installed with installLibrary(...) first.
     * Throws an error if something unexpected happens.
     * @param {ILibraryName} library The library that is being installed
     * @param {string} filename Filename of the file to add, relative to the library root
     * @param {Stream} stream The stream containing the file content
     * @returns {Promise<boolean>} true if successful
     */
    FileLibraryStorage.prototype.addLibraryFile = function (library, filename, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryExists(library)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Can't add file " + filename + " to library " + src_1.LibraryName.toUberName(library) + " because the library metadata has not been installed.");
                        }
                        fullPath = this.getFullPath(library, filename);
                        return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].dirname(fullPath))];
                    case 2:
                        _a.sent();
                        writeStream = fs_extra_1["default"].createWriteStream(fullPath);
                        return [4 /*yield*/, promisepipe_1["default"](stream, writeStream)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Removes all files of a library. Doesn't delete the library metadata. (Used when updating libraries.)
     * @param {ILibraryName} library the library whose files should be deleted
     * @returns {Promise<void>}
     */
    FileLibraryStorage.prototype.clearLibraryFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var fullLibraryPath, directoryEntries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryExists(library)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Can't clear library " + src_1.LibraryName.toUberName(library) + " because the library has not been installed.");
                        }
                        fullLibraryPath = this.getDirectoryPath(library);
                        return [4 /*yield*/, fs_extra_1["default"].readdir(fullLibraryPath)];
                    case 2:
                        directoryEntries = (_a.sent()).filter(function (entry) { return entry !== 'library.json'; });
                        return [4 /*yield*/, Promise.all(directoryEntries.map(function (entry) {
                                return fs_extra_1["default"].remove(_this.getFullPath(library, entry));
                            }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if the library contains a file
     * @param {ILibraryName} library The library to check
     * @param {string} filename
     * @returns {Promise<boolean>} true if file exists in library, false otherwise
     */
    FileLibraryStorage.prototype.fileExists = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fs_extra_1["default"].pathExists(this.getFullPath(library, filename))];
            });
        });
    };
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param {ILibraryName} library library
     * @param {string} filename the relative path inside the library
     * @returns {Promise<Stream>} a readable stream of the file's contents
     */
    FileLibraryStorage.prototype.getFileStream = function (library, filename) {
        return fs_extra_1["default"].createReadStream(path_1["default"].join(this.librariesDirectory, src_1.LibraryName.toUberName(library), filename));
    };
    /**
     * Returns all installed libraries or the installed libraries that have the machine names in the arguments.
     * @param  {...string[]} machineNames (optional) only return libraries that have these machine names
     * @returns {Promise<ILibraryName[]>} the libraries installed
     */
    FileLibraryStorage.prototype.getInstalled = function () {
        var machineNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            machineNames[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var nameRegex, libraryDirectories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nameRegex = /([^\s]+)-(\d+)\.(\d+)/;
                        return [4 /*yield*/, fs_extra_1["default"].readdir(this.librariesDirectory)];
                    case 1:
                        libraryDirectories = _a.sent();
                        return [2 /*return*/, libraryDirectories
                                .filter(function (name) { return nameRegex.test(name); })
                                .map(function (name) {
                                return src_1.LibraryName.fromUberName(name);
                            })
                                .filter(function (lib) {
                                return !machineNames ||
                                    machineNames.length === 0 ||
                                    machineNames.some(function (mn) { return mn === lib.machineName; });
                            })];
                }
            });
        });
    };
    /**
     * Gets a list of installed language files for the library.
     * @param {ILibraryName} library The library to get the languages for
     * @returns {Promise<string[]>} The list of JSON files in the language folder (without the extension .json)
     */
    FileLibraryStorage.prototype.getLanguageFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].readdir(this.getFullPath(library, 'language'))];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, files
                                .filter(function (file) { return path_1["default"].extname(file) === '.json'; })
                                .map(function (file) { return path_1["default"].basename(file, '.json'); })];
                }
            });
        });
    };
    /**
     * Adds the metadata of the library to the repository.
     * Throws errors if something goes wrong.
     * @param {ILibraryMetadata} libraryMetadata The library metadata object (= content of library.json)
     * @param {boolean} restricted True if the library can only be used be users allowed to install restricted libraries.
     * @returns {Promise<IInstalledLibrary>} The newly created library object to use when adding library files with addLibraryFile(...)
     */
    FileLibraryStorage.prototype.installLibrary = function (libraryMetadata, restricted) {
        if (restricted === void 0) { restricted = false; }
        return __awaiter(this, void 0, void 0, function () {
            var library, libPath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        library = new src_1.InstalledLibrary(libraryMetadata.machineName, libraryMetadata.majorVersion, libraryMetadata.minorVersion, libraryMetadata.patchVersion, restricted);
                        libPath = this.getDirectoryPath(library);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(libPath)];
                    case 1:
                        if (_a.sent()) {
                            throw new Error("Library " + src_1.LibraryName.toUberName(library) + " has already been installed.");
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        return [4 /*yield*/, fs_extra_1["default"].ensureDir(libPath)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].writeJSON(this.getFullPath(library, 'library.json'), libraryMetadata)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, library];
                    case 5:
                        error_1 = _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].remove(libPath)];
                    case 6:
                        _a.sent();
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if the library has been installed.
     * @param name the library name
     * @returns true if the library has been installed
     */
    FileLibraryStorage.prototype.libraryExists = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fs_extra_1["default"].pathExists(this.getDirectoryPath(name))];
            });
        });
    };
    /**
     * Gets a list of all library files that exist for this library.
     * @param {ILibraryName} library
     * @returns {Promise<string[]>} all files that exist for the library
     */
    FileLibraryStorage.prototype.listFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var libPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        libPath = this.getDirectoryPath(library);
                        return [4 /*yield*/, glob_promise_1["default"](path_1["default"].join(libPath, '**/*.*'))];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (p) {
                            return path_1["default"].relative(libPath, p);
                        })];
                }
            });
        });
    };
    /**
     * Removes the library and all its files from the repository.
     * Throws errors if something went wrong.
     * @param {ILibraryName} library The library to remove.
     * @returns {Promise<void>}
     */
    FileLibraryStorage.prototype.removeLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var libPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        libPath = this.getDirectoryPath(library);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(libPath)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Library " + src_1.LibraryName.toUberName(library) + " is not installed on the system.");
                        }
                        return [4 /*yield*/, fs_extra_1["default"].remove(libPath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the library metadata.
     * This is necessary when updating to a new patch version.
     * You also need to call clearLibraryFiles(...) to remove all old files during the update process and addLibraryFile(...)
     * to add the files of the patch.
     * @param {ILibraryMetadata} libraryMetadata the new library metadata
     * @returns {Promise<IInstalledLibrary>} The updated library object
     */
    FileLibraryStorage.prototype.updateLibrary = function (libraryMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            var libPath, newLibrary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        libPath = this.getDirectoryPath(libraryMetadata);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(libPath)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error("Library " + src_1.LibraryName.toUberName(libraryMetadata) + " can't be updated as it hasn't been installed yet.");
                        }
                        return [4 /*yield*/, fs_extra_1["default"].writeJSON(this.getFullPath(libraryMetadata, 'library.json'), libraryMetadata)];
                    case 2:
                        _a.sent();
                        newLibrary = src_1.InstalledLibrary.fromMetadata(libraryMetadata);
                        return [2 /*return*/, newLibrary];
                }
            });
        });
    };
    /**
     * Gets the directory path of the specified library.
     * @param {ILibraryName} library
     * @returns {string} the absolute path to the directory
     */
    FileLibraryStorage.prototype.getDirectoryPath = function (library) {
        return path_1["default"].join(this.librariesDirectory, src_1.LibraryName.toUberName(library));
    };
    /**
     * Gets the path of any file of the specified library.
     * @param {ILibraryName} library
     * @param {string} filename
     * @returns {string} the absolute path to the file
     */
    FileLibraryStorage.prototype.getFullPath = function (library, filename) {
        return path_1["default"].join(this.librariesDirectory, src_1.LibraryName.toUberName(library), filename);
    };
    return FileLibraryStorage;
}());
exports["default"] = FileLibraryStorage;
//# sourceMappingURL=FileLibraryStorage.js.map