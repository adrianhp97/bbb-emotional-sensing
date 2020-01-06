"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * A ValidationError is an error object that is thrown when the validation of an object
 * failed and can't be continued. ValidationError can also be used to store error messages
 * if the error that occurred during validation doesn't mean that the validation has to be
 * stopped right away. In this case the ValidationError is created, messages are added to it
 * and it is thrown later.
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    /**
     * @param {string} message The first error message
     */
    function ValidationError(message) {
        var _this = this;
        if (message) {
            _this = _super.call(this, message) || this;
        }
        _this.errors = [];
        if (message) {
            _this.addError(message);
        }
        return _this;
    }
    /**
     * Adds a message to the object. You can add as many messages as you want.
     * @param {*} message
     */
    ValidationError.prototype.addError = function (message) {
        this.errors.push(message);
        this.message = this.getErrors().join('\n');
        return this;
    };
    /**
     * Returns the messages added by addError(...).
     * @returns {string[]} the messages
     */
    ValidationError.prototype.getErrors = function () {
        return this.errors;
    };
    /**
     * True if any errors were added to the error.
     * @returns {boolean}
     */
    ValidationError.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    return ValidationError;
}(Error));
exports["default"] = ValidationError;
//# sourceMappingURL=ValidationError.js.map