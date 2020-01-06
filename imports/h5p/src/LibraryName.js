"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var LibraryName = /** @class */ (function () {
    function LibraryName(machineName, majorVersion, minorVersion) {
        this.machineName = machineName;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
    }
    /**
     * Checks if two libraries are identical.
     * @param library1
     * @param library2
     */
    LibraryName.equal = function (library1, library2) {
        return (library1.machineName === library2.machineName &&
            library1.majorVersion === library2.majorVersion &&
            library1.minorVersion === library2.minorVersion);
    };
    /**
     * Creates a library object from a library name
     * @param {string} libraryName The library name in a format "H5P.Example-1.0" or "H5P.Example 1.0" (see options)
     * @param {boolean} restricted true if the library is restricted
     * @param {boolean} useWhitespace true if the parser should accept names like "H5P.Library 1.0"
     * @param {boolean} useHyphen true if the parser should accept names like "H5P.Library-1.0"
     * @returns {Library} undefined if the name could not be parsed
     */
    LibraryName.fromUberName = function (libraryName, options) {
        if (options === void 0) { options = {
            useHyphen: true,
            useWhitespace: false
        }; }
        if (!options.useHyphen && !options.useWhitespace) {
            throw new H5pError_1["default"]('You must call fromUberName with either the useHyphen or useWhitespace option, or both!');
        }
        var nameRegex = options.useHyphen && options.useWhitespace
            ? /([^\s]+)[-\s](\d+)\.(\d+)/
            : options.useHyphen
                ? /([^\s]+)-(\d+)\.(\d+)/
                : /([^\s]+)\s(\d+)\.(\d+)/;
        var result = nameRegex.exec(libraryName);
        if (!result) {
            var example = '';
            if (options.useHyphen && options.useWhitespace) {
                example = 'H5P.Example-1.0 or H5P.Example 1.0';
            }
            else if (options.useHyphen && !options.useWhitespace) {
                example = 'H5P.Example-1.0';
            }
            else {
                example = 'H5P.Example 1.0';
            }
            throw new Error("'" + libraryName + " is not a valid H5P library name (\"ubername\"). You must follow this pattern: " + example + "'");
        }
        return new LibraryName(result[1], Number.parseInt(result[2], 10), Number.parseInt(result[3], 10));
    };
    /**
     * Returns the directory name that is used for this library (e.g. H5P.ExampleLibrary-1.0)
     */
    LibraryName.toUberName = function (libraryName, options) {
        if (options === void 0) { options = {
            useHyphen: true,
            useWhitespace: false
        }; }
        if (options.useHyphen) {
            return libraryName.machineName + "-" + libraryName.majorVersion + "." + libraryName.minorVersion;
        }
        if (options.useWhitespace) {
            return libraryName.machineName + " " + libraryName.majorVersion + "." + libraryName.minorVersion;
        }
        return '';
    };
    return LibraryName;
}());
exports["default"] = LibraryName;
//# sourceMappingURL=LibraryName.js.map