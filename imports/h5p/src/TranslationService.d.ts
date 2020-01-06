import { ITranslationService } from './types';
/**
 * Allows other components to get localizations of string literals.
 */
export default class TranslationService implements ITranslationService {
    private fallbackLanguageStrings;
    private localLanguageStrings?;
    /**
     * Initializes the translation service
     * @param {[key: string]: string} fallbackLanguageStrings An object with key-value pairs that consist of ids and translation strings for the ids. The fallback strings will be used if a language string can't be found in the localization.
     * @param {[key: string]: string} localLanguageStrings (optional) An object with key-value pairs that consist of ids and translation strings for the ids.
     */
    constructor(fallbackLanguageStrings: {
        [key: string]: string;
    }, localLanguageStrings?: {
        [key: string]: string;
    });
    /**
     * Used to check if replacement keys conform to the required pattern.
     */
    private replacementKeyRegex;
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
    getTranslation(id: string, replacements?: {
        [key: string]: string;
    }): string;
    /**
     * Returns a localized language string. Falls back to the neutral language if a language string is not present in the localization.
     * @param {string} id The id of the language string to get.
     * @returns {string} The localized language string or an empty string if there is no localization and fallback value.
     */
    private getLiteral;
}
