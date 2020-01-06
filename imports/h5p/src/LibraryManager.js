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
var StreamHelpers_1 = require("./helpers/StreamHelpers");
var InstalledLibrary_1 = __importDefault(require("./InstalledLibrary"));
var LibraryName_1 = __importDefault(require("./LibraryName"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('LibraryManager');
/**
 * This class manages library installations, enumerating installed libraries etc.
 * It is storage agnostic and can be re-used in all implementations/plugins.
 */
var LibraryManager = /** @class */ (function () {
    /**
     *
     * @param {FileLibraryStorage} libraryStorage The library repository that persists library somewhere.
     */
    function LibraryManager(libraryStorage, 
    /**
     * Gets URLs at which a file in a library can be downloaded. Must be passed
     * through from the implementation.
     */
    fileUrlResolver // default is there to avoid having to pass empty function in tests
    ) {
        if (fileUrlResolver === void 0) { fileUrlResolver = function (library, filename) { return ''; }; }
        this.libraryStorage = libraryStorage;
        this.fileUrlResolver = fileUrlResolver;
        log.info('initialize');
    }
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param {ILibraryName} library library
     * @param {string} filename the relative path inside the library
     * @returns {ReadStream} a readable stream of the file's contents
     */
    LibraryManager.prototype.getFileStream = function (library, file) {
        log.debug("getting file " + file + " from library " + LibraryName_1["default"].toUberName(library));
        return this.libraryStorage.getFileStream(library, file);
    };
    /**
     * Get a list of the currently installed libraries.
     * @param {String[]?} machineNames (if supplied) only return results for the machines names in the list
     * @returns {Promise<any>} An object which has properties with the existing library machine names. The properties'
     * values are arrays of Library objects, which represent the different versions installed of this library.
     */
    LibraryManager.prototype.getInstalled = function (machineNames) {
        return __awaiter(this, void 0, void 0, function () {
            var libraries, returnObject, _i, libraries_1, library;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.verbose("checking if libraries " + machineNames + " are installed");
                        return [4 /*yield*/, (_a = this.libraryStorage).getInstalled.apply(_a, machineNames)];
                    case 1:
                        libraries = _b.sent();
                        return [4 /*yield*/, Promise.all(libraries.map(function (libName) { return __awaiter(_this, void 0, void 0, function () {
                                var installedLib, info;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            installedLib = InstalledLibrary_1["default"].fromName(libName);
                                            return [4 /*yield*/, this.loadLibrary(libName)];
                                        case 1:
                                            info = _a.sent();
                                            installedLib.patchVersion = info.patchVersion;
                                            installedLib.runnable = info.runnable;
                                            installedLib.title = info.title;
                                            return [2 /*return*/, installedLib];
                                    }
                                });
                            }); }))];
                    case 2:
                        libraries = (_b.sent()).sort(function (lib1, lib2) { return lib1.compare(lib2); });
                        returnObject = {};
                        for (_i = 0, libraries_1 = libraries; _i < libraries_1.length; _i++) {
                            library = libraries_1[_i];
                            if (!returnObject[library.machineName]) {
                                returnObject[library.machineName] = [];
                            }
                            returnObject[library.machineName].push(library);
                        }
                        return [2 /*return*/, returnObject];
                }
            });
        });
    };
    /**
     * Returns a (relative) URL for a library file that can be used to hardcode
     * URLs of specific files if necessary. Avoid using this method when possible!
     * This method does NOT check if the file exists!
     * @param library the library for which the URL should be retrieved
     * @param file the filename inside the library (path)
     * @returns the URL of the file
     */
    LibraryManager.prototype.getLibraryFileUrl = function (library, file) {
        log.debug("getting URL of file " + file + " for library " + library.machineName + "-" + library.majorVersion + "." + library.minorVersion);
        var url = this.fileUrlResolver(library, file);
        log.debug("URL resolved to " + url);
        return url;
    };
    /**
     * Returns a URL of the upgrades script in the library
     * @param library the library whose upgrade script should be accessed
     * @returns the URL of upgrades.js. Null if there is no upgrades file.
     * (The null value can be passed back to the client.)
     */
    LibraryManager.prototype.getUpgradesScriptPath = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("getting upgrades script for " + library.machineName + "-" + library.majorVersion + "." + library.minorVersion);
                        return [4 /*yield*/, this.libraryStorage.fileExists(library, 'upgrades.js')];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.getLibraryFileUrl(library, 'upgrades.js')];
                        }
                        log.debug("no upgrades script found.");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Installs or updates a library from a temporary directory.
     * It does not delete the library files in the temporary directory.
     * The method does NOT validate the library! It must be validated before calling this method!
     * Throws an error if something went wrong and deletes the files already installed.
     * @param {string} directory The path to the temporary directory that contains the library files (the root directory that includes library.json)
     * @returns {Promise<boolean>} true if successful, false if the library was not installed (without having encountered an error, e.g. because there already is a newer patch version installed)
     */
    LibraryManager.prototype.installFromDirectory = function (directory, restricted) {
        if (restricted === void 0) { restricted = false; }
        return __awaiter(this, void 0, void 0, function () {
            var newLibraryMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing from directory " + directory);
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(directory + "/library.json")];
                    case 1:
                        newLibraryMetadata = _a.sent();
                        return [4 /*yield*/, this.libraryExists(newLibraryMetadata)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.isPatchedLibrary(newLibraryMetadata)];
                    case 3:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        // Update the library if it is only a patch of an existing library
                        return [4 /*yield*/, this.updateLibrary(newLibraryMetadata, directory)];
                    case 4:
                        // Update the library if it is only a patch of an existing library
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5: 
                    // Skip installation of library if it has already been installed and the library is no patch for it.
                    return [2 /*return*/, false];
                    case 6: 
                    // Install the library if it hasn't been installed before (treat different major/minor versions the same as a new library)
                    return [4 /*yield*/, this.installLibrary(directory, newLibraryMetadata, restricted)];
                    case 7:
                        // Install the library if it hasn't been installed before (treat different major/minor versions the same as a new library)
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Is the library a patched version of an existing library?
     * @param {ILibraryMetadata} library The library the check
     * @returns {Promise<boolean>} true if the library is a patched version of an existing library, false otherwise
     */
    LibraryManager.prototype.isPatchedLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var wrappedLibraryInfos, libraryInfos, _i, libraryInfos_1, lib;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("checking if library " + LibraryName_1["default"].toUberName(library) + " is patched");
                        return [4 /*yield*/, this.getInstalled([
                                library.machineName
                            ])];
                    case 1:
                        wrappedLibraryInfos = _a.sent();
                        if (!wrappedLibraryInfos || !wrappedLibraryInfos[library.machineName]) {
                            return [2 /*return*/, false];
                        }
                        libraryInfos = wrappedLibraryInfos[library.machineName];
                        for (_i = 0, libraryInfos_1 = libraryInfos; _i < libraryInfos_1.length; _i++) {
                            lib = libraryInfos_1[_i];
                            if (lib.majorVersion === library.majorVersion &&
                                lib.minorVersion === library.minorVersion) {
                                if (lib.patchVersion < library.patchVersion) {
                                    return [2 /*return*/, true];
                                }
                                break;
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Checks if a library was installed.
     * @param library the library to check
     * @returns true if the library has been installed
     */
    LibraryManager.prototype.libraryExists = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.libraryStorage.libraryExists(library)];
            });
        });
    };
    /**
     * Check if the library contains a file
     * @param {ILibraryName} library The library to check
     * @param {string} filename
     * @return {Promise<boolean>} true if file exists in library, false otherwise
     */
    LibraryManager.prototype.libraryFileExists = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("checking if file " + filename + " exists for library " + LibraryName_1["default"].toUberName(library));
                return [2 /*return*/, this.libraryStorage.fileExists(library, filename)];
            });
        });
    };
    /**
     * Checks if the given library has a higher version than the highest installed version.
     * @param {ILibraryMetadata} library Library to compare against the highest locally installed version.
     * @returns {Promise<boolean>} true if the passed library contains a version that is higher than the highest installed version, false otherwise
     */
    LibraryManager.prototype.libraryHasUpgrade = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var wrappedLibraryInfos, allInstalledLibsOfMachineName, highestLocalLibVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.verbose("checking if library " + library.machineName + "-" + library.majorVersion + "." + library.minorVersion + " has an upgrade");
                        return [4 /*yield*/, this.getInstalled([
                                library.machineName
                            ])];
                    case 1:
                        wrappedLibraryInfos = _a.sent();
                        if (!wrappedLibraryInfos || !wrappedLibraryInfos[library.machineName]) {
                            return [2 /*return*/, false];
                        }
                        allInstalledLibsOfMachineName = wrappedLibraryInfos[library.machineName].sort(function (a, b) { return a.compareVersions(b); });
                        highestLocalLibVersion = allInstalledLibsOfMachineName[allInstalledLibsOfMachineName.length - 1];
                        if (highestLocalLibVersion.compareVersions(library) < 0) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Gets a list of files that exist in the library.
     * @param library the library for which the files should be listed
     * @return the files in the library including language files
     */
    LibraryManager.prototype.listFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.verbose("listing files for library " + LibraryName_1["default"].toUberName(library));
                return [2 /*return*/, this.libraryStorage.listFiles(library)];
            });
        });
    };
    /**
     * Gets a list of translations that exist for this library.
     * @param {ILibraryName} library
     * @returns {Promise<string[]>} the language codes for translations of this library
     */
    LibraryManager.prototype.listLanguages = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.verbose("listing languages for library " + LibraryName_1["default"].toUberName(library));
                        return [4 /*yield*/, this.libraryStorage.getLanguageFiles(library)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        log.warn("no languages found for library " + LibraryName_1["default"].toUberName(library));
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the language file for the specified language.
     * @param {ILibraryName} library
     * @param {string} language the language code
     * @returns {Promise<any>} the decoded JSON data in the language file
     */
    LibraryManager.prototype.loadLanguage = function (library, language) {
        return __awaiter(this, void 0, void 0, function () {
            var ignored_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.debug("loading language " + language + " for library " + LibraryName_1["default"].toUberName(library));
                        return [4 /*yield*/, this.getJsonFile(library, path_1["default"].join('language', language + ".json"))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        ignored_1 = _a.sent();
                        log.debug("language '" + language + "' not found for " + LibraryName_1["default"].toUberName(library));
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the information about the library that is contained in library.json.
     * @param {ILibraryName} library The library to get (machineName, majorVersion and minorVersion is enough)
     * @returns {Promise<ILibrary>} the decoded JSON data or undefined if library is not installed
     */
    LibraryManager.prototype.loadLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var libraryMetadata, _a, ignored_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        log.debug("loading library " + LibraryName_1["default"].toUberName(library));
                        return [4 /*yield*/, this.getJsonFile(library, 'library.json')];
                    case 1:
                        libraryMetadata = _b.sent();
                        _a = libraryMetadata;
                        return [4 /*yield*/, this.libraryExists(library)];
                    case 2:
                        _a.libraryId = _b.sent();
                        return [2 /*return*/, libraryMetadata];
                    case 3:
                        ignored_2 = _b.sent();
                        log.warn("library " + LibraryName_1["default"].toUberName(library) + " is not installed");
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the content of semantics.json for the specified library.
     * @param {ILibraryName} library
     * @returns {Promise<any>} the content of semantics.json
     */
    LibraryManager.prototype.loadSemantics = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("loading semantics for library " + LibraryName_1["default"].toUberName(library));
                return [2 /*return*/, this.getJsonFile(library, 'semantics.json')];
            });
        });
    };
    /**
     * Checks (as far as possible) if all necessary files are present for the library to run properly.
     * @param {ILibraryName} library The library to check
     * @returns {Promise<boolean>} true if the library is ok. Throws errors if not.
     */
    LibraryManager.prototype.checkConsistency = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryExists(library)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("Error in library " + LibraryName_1["default"].toUberName(library) + ": not installed.");
                            throw new Error("Error in library " + LibraryName_1["default"].toUberName(library) + ": not installed.");
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getJsonFile(library, 'library.json')];
                    case 3:
                        metadata = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error("Error in library " + LibraryName_1["default"].toUberName(library) + ": library.json not readable: " + error_2.message + ".");
                    case 5:
                        if (!metadata.preloadedJs) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.checkFiles(library, metadata.preloadedJs.map(function (js) { return js.path; }))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!metadata.preloadedCss) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.checkFiles(library, metadata.preloadedCss.map(function (css) { return css.path; }))];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Checks if all files in the list are present in the library.
     * @param {ILibraryName} library The library to check
     * @param {string[]} requiredFiles The files (relative paths in the library) that must be present
     * @returns {Promise<boolean>} true if all dependencies are present. Throws an error if any are missing.
     */
    LibraryManager.prototype.checkFiles = function (library, requiredFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var missingFiles, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("checking files " + requiredFiles.join(', ') + " for " + LibraryName_1["default"].toUberName(library));
                        return [4 /*yield*/, Promise.all(requiredFiles.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                path: file
                                            };
                                            return [4 /*yield*/, this.libraryStorage.fileExists(library, file)];
                                        case 1: return [2 /*return*/, (_a.status = _b.sent(),
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 1:
                        missingFiles = (_a.sent())
                            .filter(function (file) { return !file.status; })
                            .map(function (file) { return file.path; });
                        if (missingFiles.length > 0) {
                            message = "Error(s) in library " + LibraryName_1["default"].toUberName(library) + ":\n";
                            message += missingFiles
                                .map(function (file) { return file + " is missing."; })
                                .join('\n');
                            throw new Error(message);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Copies all library files from a directory (excludes library.json) to the storage.
     * Throws errors if something went wrong.
     * @param {string} fromDirectory The directory to copy from
     * @param {ILibraryName} libraryInfo the library object
     * @returns {Promise<void>}
     */
    LibraryManager.prototype.copyLibraryFiles = function (fromDirectory, libraryInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("copying library files from " + fromDirectory);
                        return [4 /*yield*/, glob_promise_1["default"](fromDirectory + "/**/*.*")];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (fileFullPath) {
                                var fileLocalPath = path_1["default"].relative(fromDirectory, fileFullPath);
                                if (fileLocalPath === 'library.json') {
                                    return Promise.resolve(true);
                                }
                                var readStream = fs_extra_1["default"].createReadStream(fileFullPath);
                                return _this.libraryStorage.addLibraryFile(libraryInfo, fileLocalPath, readStream);
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the parsed contents of a library file that is JSON.
     * @param {ILibraryName} library
     * @param {string} file
     * @returns {Promise<any|undefined>} The content or undefined if there was an error
     */
    LibraryManager.prototype.getJsonFile = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, jsonString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.silly("loading " + file + " for library " + LibraryName_1["default"].toUberName(library));
                        return [4 /*yield*/, this.libraryStorage.getFileStream(library, file)];
                    case 1:
                        stream = _a.sent();
                        return [4 /*yield*/, StreamHelpers_1.streamToString(stream)];
                    case 2:
                        jsonString = _a.sent();
                        return [2 /*return*/, JSON.parse(jsonString)];
                }
            });
        });
    };
    /**
     * Installs a library and rolls back changes if the library installation failed.
     * Throws errors if something went wrong.
     * @param {string} fromDirectory the local directory to install from
     * @param {ILibraryName} libraryInfo the library object
     * @param {any} libraryMetadata the library metadata
     * @param {boolean} restricted true if the library can only be installed with a special permission
     * @returns {IInstalledLibrary} the libray object (containing - among others - the id of the newly installed library)
     */
    LibraryManager.prototype.installLibrary = function (fromDirectory, libraryMetadata, restricted) {
        return __awaiter(this, void 0, void 0, function () {
            var newLibraryInfo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing library " + LibraryName_1["default"].toUberName(libraryMetadata) + " from " + fromDirectory);
                        return [4 /*yield*/, this.libraryStorage.installLibrary(libraryMetadata, restricted)];
                    case 1:
                        newLibraryInfo = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        return [4 /*yield*/, this.copyLibraryFiles(fromDirectory, newLibraryInfo)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.checkConsistency(libraryMetadata)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        error_3 = _a.sent();
                        log.error("There was a consistency error when installing library " + LibraryName_1["default"].toUberName(libraryMetadata) + ". Reverting installation.");
                        return [4 /*yield*/, this.libraryStorage.removeLibrary(libraryMetadata)];
                    case 6:
                        _a.sent();
                        throw error_3;
                    case 7:
                        log.debug("library " + LibraryName_1["default"].toUberName(libraryMetadata) + " successfully installed.");
                        return [2 /*return*/, newLibraryInfo];
                }
            });
        });
    };
    /**
     * Updates the library to a new version.
     * REMOVES THE LIBRARY IF THERE IS AN ERROR!!!
     * @param filesDirectory the path of the directory containing the library files to update to
     * @param library the library object
     * @param newLibraryMetadata the library metadata (library.json)
     */
    LibraryManager.prototype.updateLibrary = function (newLibraryMetadata, filesDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        log.info("updating library " + LibraryName_1["default"].toUberName(newLibraryMetadata) + " in " + filesDirectory);
                        return [4 /*yield*/, this.libraryStorage.updateLibrary(newLibraryMetadata)];
                    case 1:
                        _a.sent();
                        log.info("clearing library " + LibraryName_1["default"].toUberName(newLibraryMetadata) + " from files");
                        return [4 /*yield*/, this.libraryStorage.clearLibraryFiles(newLibraryMetadata)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.copyLibraryFiles(filesDirectory, newLibraryMetadata)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.checkConsistency(newLibraryMetadata)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        error_4 = _a.sent();
                        log.error(error_4);
                        log.info("removing library " + LibraryName_1["default"].toUberName(newLibraryMetadata));
                        return [4 /*yield*/, this.libraryStorage.removeLibrary(newLibraryMetadata)];
                    case 6:
                        _a.sent();
                        throw error_4;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return LibraryManager;
}());
exports["default"] = LibraryManager;
//# sourceMappingURL=LibraryManager.js.map