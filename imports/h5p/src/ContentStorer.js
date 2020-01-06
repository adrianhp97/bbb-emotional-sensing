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
var shortid_1 = __importDefault(require("shortid"));
var ContentFileScanner_1 = require("./ContentFileScanner");
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('ContentStorer');
/**
 * Contains logic to store content in permanent storage. Copies files from temporary storage and
 * deletes unused files.
 */
var ContentStorer = /** @class */ (function () {
    function ContentStorer(contentManager, libraryManager, temporaryFileManager) {
        this.contentManager = contentManager;
        this.temporaryFileManager = temporaryFileManager;
        this.contentFileScanner = new ContentFileScanner_1.ContentFileScanner(libraryManager);
    }
    /**
     * Scans through the parameters of the content and copies all referenced files into
     * temporary storage.
     * @param packageDirectory
     * @param user
     * @returns the metadata and parameters of the content
     */
    ContentStorer.prototype.copyFromDirectoryToTemporary = function (packageDirectory, user) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, parameters, fileReferencesInParams, _i, fileReferencesInParams_1, reference, filepath, readStream, newFilename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1["default"].readJSON(path_1["default"].join(packageDirectory, 'h5p.json'))];
                    case 1:
                        metadata = _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path_1["default"].join(packageDirectory, 'content', 'content.json'))];
                    case 2:
                        parameters = _a.sent();
                        return [4 /*yield*/, this.contentFileScanner.scanForFiles(parameters, metadata.preloadedDependencies.find(function (l) { return l.machineName === metadata.mainLibrary; }))];
                    case 3:
                        fileReferencesInParams = _a.sent();
                        _i = 0, fileReferencesInParams_1 = fileReferencesInParams;
                        _a.label = 4;
                    case 4:
                        if (!(_i < fileReferencesInParams_1.length)) return [3 /*break*/, 8];
                        reference = fileReferencesInParams_1[_i];
                        filepath = path_1["default"].join(packageDirectory, 'content', reference.filePath);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(filepath)];
                    case 5:
                        if (!(_a.sent())) {
                            return [3 /*break*/, 7];
                        }
                        readStream = fs_extra_1["default"].createReadStream(filepath);
                        return [4 /*yield*/, this.temporaryFileManager.saveFile(reference.filePath, readStream, user)];
                    case 6:
                        newFilename = _a.sent();
                        reference.context.params.path = newFilename + "#tmp";
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8: return [2 /*return*/, { metadata: metadata, parameters: parameters }];
                }
            });
        });
    };
    /**
     * Saves content in the persistence system. Also copies over files from temporary storage
     * or from other content if the content was pasted from there.
     * @param contentId the contentId (can be undefined if previously unsaved)
     * @param parameters the parameters of teh content (= content.json)
     * @param metadata = content of h5p.json
     * @param mainLibraryName the library name
     * @param user the user who wants to save the file
     */
    ContentStorer.prototype.saveOrUpdateContent = function (contentId, parameters, metadata, mainLibraryName, user) {
        return __awaiter(this, void 0, void 0, function () {
            var isUpdate, filesInOldParams, _a, fileReferencesInNewParams, filesToCopyFromTemporaryStorage, newContentId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isUpdate = contentId !== undefined;
                        if (!isUpdate) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getFilesInParams(contentId, user)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = [];
                        _b.label = 3;
                    case 3:
                        filesInOldParams = _a;
                        return [4 /*yield*/, this.contentFileScanner.scanForFiles(parameters, mainLibraryName)];
                    case 4:
                        fileReferencesInNewParams = _b.sent();
                        return [4 /*yield*/, this.determineFilesToCopyFromTemporaryStorage(fileReferencesInNewParams, filesInOldParams)];
                    case 5:
                        filesToCopyFromTemporaryStorage = _b.sent();
                        return [4 /*yield*/, this.contentManager.createOrUpdateContent(metadata, parameters, user, contentId)];
                    case 6:
                        newContentId = _b.sent();
                        // All files added to the piece of content during the editor session are only stored
                        // in temporary storage. We need to copy them over from there.
                        return [4 /*yield*/, this.copyFilesFromTemporaryStorage(filesToCopyFromTemporaryStorage, user, newContentId, isUpdate // We only delete the temporary file when this is an update. If new content is stored, the temporary
                            // files might still be needed, e.g. if the user accidentally presses save twice. They will be deleted through
                            // the regular expiration mechanism at some point.
                            )];
                    case 7:
                        // All files added to the piece of content during the editor session are only stored
                        // in temporary storage. We need to copy them over from there.
                        _b.sent();
                        return [4 /*yield*/, this.copyFilesFromPasteSource(fileReferencesInNewParams, user, newContentId)];
                    case 8:
                        if (!_b.sent()) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.contentManager.createOrUpdateContent(metadata, parameters, user, newContentId)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        if (!(contentId !== undefined)) return [3 /*break*/, 12];
                        // we compare against the old content id, as we can check that way
                        // if the content was saved previously
                        return [4 /*yield*/, this.deleteUnusedOldFiles(newContentId, filesInOldParams, fileReferencesInNewParams.map(function (f) { return f.filePath; }))];
                    case 11:
                        // we compare against the old content id, as we can check that way
                        // if the content was saved previously
                        _b.sent();
                        _b.label = 12;
                    case 12: return [2 /*return*/, newContentId];
                }
            });
        });
    };
    /**
     * Looks through the file references and check if any of them originate from a copy & paste
     * operation. (Can be detected by checking if the path is relative.) If there are copy & pasted
     * files, these files will be copied over to the new contentId and the references will be updated
     * accordingly.
     * @param fileReferencesInParams The file references found in the parameters
     * @param user the user who wants to save the content
     * @param contentId the content the files will be attached to
     * @returns true if file reference were changed and the changed parameters must be saved
     */
    ContentStorer.prototype.copyFilesFromPasteSource = function (fileReferencesInParams, user, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var changedSomething, _i, fileReferencesInParams_2, ref, matches, sourceContentId, sourceFilename, sourceFileStream, pastedFilename, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changedSomething = false;
                        _i = 0, fileReferencesInParams_2 = fileReferencesInParams;
                        _a.label = 1;
                    case 1:
                        if (!(_i < fileReferencesInParams_2.length)) return [3 /*break*/, 8];
                        ref = fileReferencesInParams_2[_i];
                        // Check for relative paths
                        log.debug("Checking if file " + ref.filePath + " is a relative path.");
                        matches = ref.filePath.match(/^\.\.\/content\/([\w\-._]+)\/([\w\-.\/_]+)$/);
                        if (!matches || matches.length === 0) {
                            return [3 /*break*/, 7];
                        }
                        sourceContentId = matches[1];
                        sourceFilename = matches[2];
                        log.debug("Copying pasted file " + sourceFilename + " from " + sourceContentId + ".");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.contentManager.getContentFileStream(sourceContentId, sourceFilename, user)];
                    case 3:
                        sourceFileStream = _a.sent();
                        return [4 /*yield*/, this.getUniqueFilename(contentId, sourceFilename)];
                    case 4:
                        pastedFilename = _a.sent();
                        return [4 /*yield*/, this.contentManager.addContentFile(contentId, pastedFilename, sourceFileStream, user)];
                    case 5:
                        _a.sent();
                        // We have to replace the relative path with the path of the just saved file
                        ref.context.params.path = pastedFilename;
                        changedSomething = true;
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        // If something went wrong, we simply remove the reference to the file from the params.
                        log.error("Could not copy file " + sourceFilename + " from " + sourceContentId + ": " + error_1 + ". Removing the reference in the pasted content.");
                        ref.context.params.path = '';
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, changedSomething];
                }
            });
        });
    };
    /**
     * Copies files from temporary storage into permanent storage
     * @param files the list of filenames to copy
     * @param user the user who is saving the content
     * @param contentId the content id of the object
     * @param deleteTemporaryFiles true if temporary files should be deleted after copying
     */
    ContentStorer.prototype.copyFilesFromTemporaryStorage = function (files, user, contentId, deleteTemporaryFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, files_1, fileToCopy, readStream, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 11];
                        fileToCopy = files_1[_i];
                        readStream = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.temporaryFileManager.getFileStream(fileToCopy, user)];
                    case 3:
                        readStream = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        // We just log this error and continue.
                        log.error("Temporary file " + fileToCopy + " does not exist or is not accessible to user: " + error_2);
                        return [3 /*break*/, 5];
                    case 5:
                        _a.trys.push([5, , 9, 10]);
                        if (!(readStream !== undefined)) return [3 /*break*/, 8];
                        log.debug("Adding temporary file " + fileToCopy + " to content id " + contentId);
                        return [4 /*yield*/, this.contentManager.addContentFile(contentId, fileToCopy, readStream, user)];
                    case 6:
                        _a.sent();
                        if (!deleteTemporaryFiles) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.temporaryFileManager.deleteFile(fileToCopy, user)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        readStream.close();
                        return [7 /*endfinally*/];
                    case 10:
                        _i++;
                        return [3 /*break*/, 1];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes old files by comparing the two lists and removing those files that
     * are not present in newFiles anymore.
     * @param contentId
     * @param oldFiles
     * @param newFiles
     */
    ContentStorer.prototype.deleteUnusedOldFiles = function (contentId, oldFiles, newFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _i, oldFiles_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (file) {
                            var error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!newFiles.some(function (f) { return f === file; })) return [3 /*break*/, 4];
                                        log.debug("Deleting unneccessary file " + file + " from " + contentId);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this_1.contentManager.deleteContentFile(contentId, file)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_3 = _a.sent();
                                        log.error("Could not delete unused content file: " + error_3);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, oldFiles_1 = oldFiles;
                        _a.label = 1;
                    case 1:
                        if (!(_i < oldFiles_1.length)) return [3 /*break*/, 4];
                        file = oldFiles_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a list of files that must be copied to permanent storage and modifies the path
     * of these files in the fileReferencesInNewParams object!
     * NOTE: Mind the side effect on fileReferencesInNewParams!
     * @param fileReferencesInNewParams
     * @returns the list of files to copy
     */
    ContentStorer.prototype.determineFilesToCopyFromTemporaryStorage = function (fileReferencesInNewParams, oldFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var filesToCopyFromTemporaryStorage, _loop_2, _i, fileReferencesInNewParams_1, ref;
            return __generator(this, function (_a) {
                filesToCopyFromTemporaryStorage = [];
                _loop_2 = function (ref) {
                    // We mark the file to be copied over from temporary storage if the file has a temporary marker.
                    if (ref.temporary) {
                        // We only save temporary file for later copying, however, if the there isn't already a file
                        // with the exact name. This might be the case if the user presses "save" twice.
                        if (!oldFiles.some(function (f) { return f === ref.filePath; })) {
                            filesToCopyFromTemporaryStorage.push(ref.filePath);
                        }
                        // remove temporary file marker from parameters
                        ref.context.params.path = ref.filePath;
                    }
                };
                for (_i = 0, fileReferencesInNewParams_1 = fileReferencesInNewParams; _i < fileReferencesInNewParams_1.length; _i++) {
                    ref = fileReferencesInNewParams_1[_i];
                    _loop_2(ref);
                }
                return [2 /*return*/, filesToCopyFromTemporaryStorage];
            });
        });
    };
    /**
     * Retrieves a list of files in the parameters of a content object.
     * @param contentId
     * @param user
     * @returns the list of files
     */
    ContentStorer.prototype.getFilesInParams = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var oldParams, oldMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentManager.loadContent(contentId, user)];
                    case 1:
                        oldParams = _a.sent();
                        return [4 /*yield*/, this.contentManager.loadH5PJson(contentId, user)];
                    case 2:
                        oldMetadata = _a.sent();
                        return [4 /*yield*/, this.contentFileScanner.scanForFiles(oldParams, oldMetadata.preloadedDependencies.find(function (dep) { return dep.machineName === oldMetadata.mainLibrary; }))];
                    case 3: return [2 /*return*/, (_a.sent()).map(function (fi) { return fi.filePath; })];
                }
            });
        });
    };
    /**
     * Generates a unique filename. Removes short-ids that were added to filenames
     * @param contentId the content object for which the file is about to be saved
     * @param filename the filename on which to base the unique filename on
     * @returns a unique filename (within the content object)
     */
    ContentStorer.prototype.getUniqueFilename = function (contentId, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var actualFilename, match, attempts, filenameAttempt, exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("Getting unique name for " + filename + ".");
                        actualFilename = filename;
                        match = filename.match(/^(.+?)-(.+?)(\.\w+)$/);
                        if (match && shortid_1["default"].isValid(match[2])) {
                            actualFilename = match[1] + match[3];
                            log.debug("Actual filename is " + actualFilename + ".");
                        }
                        attempts = 0;
                        filenameAttempt = '';
                        exists = false;
                        _a.label = 1;
                    case 1:
                        filenameAttempt = path_1["default"].basename(actualFilename, path_1["default"].extname(actualFilename)) + "-" + shortid_1["default"]() + path_1["default"].extname(actualFilename);
                        log.debug("Checking if " + filenameAttempt + " already exists");
                        return [4 /*yield*/, this.contentManager.contentFileExists(contentId, filenameAttempt)];
                    case 2:
                        exists = _a.sent();
                        attempts += 1;
                        _a.label = 3;
                    case 3:
                        if (attempts < 5 && exists) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        if (exists) {
                            log.error("Cannot determine a unique filename for " + filename);
                            throw new Error("Cannot determine a unique filename for " + filename);
                        }
                        log.debug("Unique filename is " + filenameAttempt);
                        return [2 /*return*/, filenameAttempt];
                }
            });
        });
    };
    return ContentStorer;
}());
exports["default"] = ContentStorer;
//# sourceMappingURL=ContentStorer.js.map