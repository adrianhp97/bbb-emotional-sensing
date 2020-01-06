"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// Classes
var H5PEditor_1 = __importDefault(require("./H5PEditor"));
exports.H5PEditor = H5PEditor_1["default"];
var H5PPlayer_1 = __importDefault(require("./H5PPlayer"));
exports.H5PPlayer = H5PPlayer_1["default"];
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
exports.H5pError = H5pError_1["default"];
var InstalledLibrary_1 = __importDefault(require("./InstalledLibrary"));
exports.InstalledLibrary = InstalledLibrary_1["default"];
var LibraryName_1 = __importDefault(require("./LibraryName"));
exports.LibraryName = LibraryName_1["default"];
var PackageExporter_1 = __importDefault(require("./PackageExporter"));
exports.PackageExporter = PackageExporter_1["default"];
var TranslationService_1 = __importDefault(require("./TranslationService"));
exports.TranslationService = TranslationService_1["default"];
// Interfaces
var types_1 = require("./types");
exports.Permission = types_1.Permission;
// Assets
var en_json_1 = __importDefault(require("./translations/en.json"));
exports.englishStrings = en_json_1["default"];
//# sourceMappingURL=index.js.map