"use strict";
exports.__esModule = true;
/**
 * Content metadata object with defaults for required values and
 * sanitization to make sure it the metadata conforms to the schema.
 */
var ContentMetadata = /** @class */ (function () {
    /**
     * Creates an object conforming to the h5p.json schema.
     * @param furtherMetadata these objects will be merged into the newly created object
     */
    function ContentMetadata() {
        var furtherMetadata = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            furtherMetadata[_i] = arguments[_i];
        }
        this.embedTypes = ['iframe'];
        this.language = 'en';
        for (var _a = 0, furtherMetadata_1 = furtherMetadata; _a < furtherMetadata_1.length; _a++) {
            var metadata = furtherMetadata_1[_a];
            Object.assign(this, metadata);
        }
        // Remove empty arrays for authors and changes, as this validates the
        // H5P schema.
        if (this.authors && this.authors.length === 0) {
            this.authors = undefined;
        }
        if (this.changes && this.changes.length === 0) {
            this.changes = undefined;
        }
    }
    return ContentMetadata;
}());
exports.ContentMetadata = ContentMetadata;
//# sourceMappingURL=ContentMetadata.js.map