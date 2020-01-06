/**
 * A ValidationError is an error object that is thrown when the validation of an object
 * failed and can't be continued. ValidationError can also be used to store error messages
 * if the error that occurred during validation doesn't mean that the validation has to be
 * stopped right away. In this case the ValidationError is created, messages are added to it
 * and it is thrown later.
 */
export default class ValidationError extends Error {
    /**
     * @param {string} message The first error message
     */
    constructor(message?: string);
    private errors;
    /**
     * Adds a message to the object. You can add as many messages as you want.
     * @param {*} message
     */
    addError(message: any): ValidationError;
    /**
     * Returns the messages added by addError(...).
     * @returns {string[]} the messages
     */
    getErrors(): string[];
    /**
     * True if any errors were added to the error.
     * @returns {boolean}
     */
    hasErrors(): boolean;
}
