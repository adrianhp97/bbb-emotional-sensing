"use strict";
exports.__esModule = true;
/**
 * Stores information about installed H5P libraries.
 */
var InstalledLibrary = /** @class */ (function () {
    function InstalledLibrary(machineName, majorVersion, minorVersion, patchVersion, restricted) {
        if (restricted === void 0) { restricted = false; }
        this.machineName = machineName;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
        this.patchVersion = patchVersion;
        this.restricted = restricted;
        this.machineName = machineName;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
        this.patchVersion = patchVersion;
        this.title = undefined;
        this.runnable = undefined;
        this.restricted = restricted;
    }
    InstalledLibrary.fromMetadata = function (name) {
        return new InstalledLibrary(name.machineName, name.majorVersion, name.minorVersion, name.patchVersion, undefined);
    };
    InstalledLibrary.fromName = function (name) {
        return new InstalledLibrary(name.machineName, name.majorVersion, name.minorVersion, undefined, undefined);
    };
    /**
     * Compares libraries by giving precedence to title, then major version, then minor version
     * @param otherLibrary
     */
    InstalledLibrary.prototype.compare = function (otherLibrary) {
        return (this.title.localeCompare(otherLibrary.title) ||
            this.majorVersion - otherLibrary.majorVersion ||
            this.minorVersion - otherLibrary.minorVersion);
    };
    /**
     * Compares libraries by giving precedence to major version, then minor version, then patch version.
     * @param otherLibrary
     */
    InstalledLibrary.prototype.compareVersions = function (otherLibrary) {
        return (this.majorVersion - otherLibrary.majorVersion ||
            this.minorVersion - otherLibrary.minorVersion ||
            this.patchVersion - otherLibrary.patchVersion);
    };
    return InstalledLibrary;
}());
exports["default"] = InstalledLibrary;
//# sourceMappingURL=InstalledLibrary.js.map