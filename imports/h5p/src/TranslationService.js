"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var escape_html_1 = __importDefault(require("escape-html"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var log = new Logger_1["default"]('TranslationService');
/**
 * Allows other components to get localizations of string literals.
 */
var TranslationService = /** @class */ (function () {
    /**
     * Initializes the translation service
     * @param {[key: string]: string} fallbackLanguageStrings An object with key-value pairs that consist of ids and translation strings for the ids. The fallback strings will be used if a language string can't be found in the localization.
     * @param {[key: string]: string} localLanguageStrings (optional) An object with key-value pairs that consist of ids and translation strings for the ids.
     */
    function TranslationService(fallbackLanguageStrings, localLanguageStrings) {
        this.fallbackLanguageStrings = fallbackLanguageStrings;
        this.localLanguageStrings = localLanguageStrings;
        /**
         * Used to check if replacement keys conform to the required pattern.
         */
        this.replacementKeyRegex = /(!|@|%)[a-z0-9-]+/i;
        log.info("initialize");
        this.localLanguageStrings =
            localLanguageStrings || fallbackLanguageStrings;
    }
    /**
     * Gets the literal for the identifier and performs replacements of placeholders / variables.
     * @param {string} id The identifier of the literal
     * @param {[key: string]: string} replacements An object with the replacement variables in key-value format.
     * Incidences of any key in this array are replaced with the corresponding value. Based
     * on the first character of the key, the value is escaped and/or themed:
     *    - !variable inserted as is
     *    - &#064;variable escape plain text to HTML
     *    - %variable escape text to HTML and theme as a placeholder for user-submitted content
     * @returns The literal translated into the language used by the user and with replacements.
     */
    TranslationService.prototype.getTranslation = function (id, replacements) {
        if (replacements === void 0) { replacements = {}; }
        log.verbose("getting translation " + id);
        var literal = this.getLiteral(id);
        if (literal === '')
            return '';
        // tslint:disable-next-line: forin
        for (var replacementKey in replacements) {
            // skip keys that don't can't be replaced with regex
            if (!this.replacementKeyRegex.test(replacementKey)) {
                throw new Error("The replacement key " + replacementKey + " is malformed. A replacement key must start with one of these characters:!@%");
            }
            var valueToPutIn = void 0;
            if (replacementKey[0] === '@') {
                valueToPutIn = escape_html_1["default"](replacements[replacementKey]);
            }
            else if (replacementKey[0] === '%') {
                valueToPutIn = "<em>" + escape_html_1["default"](replacements[replacementKey]) + "</em>";
            }
            else if (replacementKey[0] === '!') {
                valueToPutIn = replacements[replacementKey];
            }
            else {
                throw new Error("The replacement key " + replacementKey + " is malformed. A replacement key must start with one of these characters:!@%");
            }
            literal = literal.replace(new RegExp(replacementKey, 'g'), valueToPutIn);
        }
        return literal;
    };
    /**
     * Returns a localized language string. Falls back to the neutral language if a language string is not present in the localization.
     * @param {string} id The id of the language string to get.
     * @returns {string} The localized language string or an empty string if there is no localization and fallback value.
     */
    TranslationService.prototype.getLiteral = function (id) {
        log.debug("getting literal " + id);
        return (this.localLanguageStrings[id] ||
            this.fallbackLanguageStrings[id] ||
            '');
    };
    return TranslationService;
}());
exports["default"] = TranslationService;
//# sourceMappingURL=TranslationService.js.map