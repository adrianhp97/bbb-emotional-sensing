/// <reference types="node" />
import { ReadStream } from 'fs';
import LibraryName from './LibraryName';
import { IInstalledLibrary, ILibraryFileUrlResolver, ILibraryMetadata, ILibraryName, ILibraryStorage, ISemanticsEntry } from './types';
/**
 * This class manages library installations, enumerating installed libraries etc.
 * It is storage agnostic and can be re-used in all implementations/plugins.
 */
export default class LibraryManager {
    private libraryStorage;
    /**
     * Gets URLs at which a file in a library can be downloaded. Must be passed
     * through from the implementation.
     */
    private fileUrlResolver;
    /**
     *
     * @param {FileLibraryStorage} libraryStorage The library repository that persists library somewhere.
     */
    constructor(libraryStorage: ILibraryStorage, 
    /**
     * Gets URLs at which a file in a library can be downloaded. Must be passed
     * through from the implementation.
     */
    fileUrlResolver?: ILibraryFileUrlResolver);
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param {ILibraryName} library library
     * @param {string} filename the relative path inside the library
     * @returns {ReadStream} a readable stream of the file's contents
     */
    getFileStream(library: ILibraryName, file: string): ReadStream;
    /**
     * Get a list of the currently installed libraries.
     * @param {String[]?} machineNames (if supplied) only return results for the machines names in the list
     * @returns {Promise<any>} An object which has properties with the existing library machine names. The properties'
     * values are arrays of Library objects, which represent the different versions installed of this library.
     */
    getInstalled(machineNames?: string[]): Promise<{
        [key: string]: IInstalledLibrary[];
    }>;
    /**
     * Returns a (relative) URL for a library file that can be used to hardcode
     * URLs of specific files if necessary. Avoid using this method when possible!
     * This method does NOT check if the file exists!
     * @param library the library for which the URL should be retrieved
     * @param file the filename inside the library (path)
     * @returns the URL of the file
     */
    getLibraryFileUrl(library: ILibraryName, file: string): string;
    /**
     * Returns a URL of the upgrades script in the library
     * @param library the library whose upgrade script should be accessed
     * @returns the URL of upgrades.js. Null if there is no upgrades file.
     * (The null value can be passed back to the client.)
     */
    getUpgradesScriptPath(library: ILibraryName): Promise<string>;
    /**
     * Installs or updates a library from a temporary directory.
     * It does not delete the library files in the temporary directory.
     * The method does NOT validate the library! It must be validated before calling this method!
     * Throws an error if something went wrong and deletes the files already installed.
     * @param {string} directory The path to the temporary directory that contains the library files (the root directory that includes library.json)
     * @returns {Promise<boolean>} true if successful, false if the library was not installed (without having encountered an error, e.g. because there already is a newer patch version installed)
     */
    installFromDirectory(directory: string, restricted?: boolean): Promise<boolean>;
    /**
     * Is the library a patched version of an existing library?
     * @param {ILibraryMetadata} library The library the check
     * @returns {Promise<boolean>} true if the library is a patched version of an existing library, false otherwise
     */
    isPatchedLibrary(library: ILibraryMetadata): Promise<boolean>;
    /**
     * Checks if a library was installed.
     * @param library the library to check
     * @returns true if the library has been installed
     */
    libraryExists(library: LibraryName): Promise<boolean>;
    /**
     * Check if the library contains a file
     * @param {ILibraryName} library The library to check
     * @param {string} filename
     * @return {Promise<boolean>} true if file exists in library, false otherwise
     */
    libraryFileExists(library: ILibraryName, filename: string): Promise<boolean>;
    /**
     * Checks if the given library has a higher version than the highest installed version.
     * @param {ILibraryMetadata} library Library to compare against the highest locally installed version.
     * @returns {Promise<boolean>} true if the passed library contains a version that is higher than the highest installed version, false otherwise
     */
    libraryHasUpgrade(library: ILibraryMetadata): Promise<boolean>;
    /**
     * Gets a list of files that exist in the library.
     * @param library the library for which the files should be listed
     * @return the files in the library including language files
     */
    listFiles(library: ILibraryName): Promise<string[]>;
    /**
     * Gets a list of translations that exist for this library.
     * @param {ILibraryName} library
     * @returns {Promise<string[]>} the language codes for translations of this library
     */
    listLanguages(library: ILibraryName): Promise<string[]>;
    /**
     * Gets the language file for the specified language.
     * @param {ILibraryName} library
     * @param {string} language the language code
     * @returns {Promise<any>} the decoded JSON data in the language file
     */
    loadLanguage(library: ILibraryName, language: string): Promise<any>;
    /**
     * Returns the information about the library that is contained in library.json.
     * @param {ILibraryName} library The library to get (machineName, majorVersion and minorVersion is enough)
     * @returns {Promise<ILibrary>} the decoded JSON data or undefined if library is not installed
     */
    loadLibrary(library: ILibraryName): Promise<IInstalledLibrary>;
    /**
     * Returns the content of semantics.json for the specified library.
     * @param {ILibraryName} library
     * @returns {Promise<any>} the content of semantics.json
     */
    loadSemantics(library: ILibraryName): Promise<ISemanticsEntry[]>;
    /**
     * Checks (as far as possible) if all necessary files are present for the library to run properly.
     * @param {ILibraryName} library The library to check
     * @returns {Promise<boolean>} true if the library is ok. Throws errors if not.
     */
    private checkConsistency;
    /**
     * Checks if all files in the list are present in the library.
     * @param {ILibraryName} library The library to check
     * @param {string[]} requiredFiles The files (relative paths in the library) that must be present
     * @returns {Promise<boolean>} true if all dependencies are present. Throws an error if any are missing.
     */
    private checkFiles;
    /**
     * Copies all library files from a directory (excludes library.json) to the storage.
     * Throws errors if something went wrong.
     * @param {string} fromDirectory The directory to copy from
     * @param {ILibraryName} libraryInfo the library object
     * @returns {Promise<void>}
     */
    private copyLibraryFiles;
    /**
     * Gets the parsed contents of a library file that is JSON.
     * @param {ILibraryName} library
     * @param {string} file
     * @returns {Promise<any|undefined>} The content or undefined if there was an error
     */
    private getJsonFile;
    /**
     * Installs a library and rolls back changes if the library installation failed.
     * Throws errors if something went wrong.
     * @param {string} fromDirectory the local directory to install from
     * @param {ILibraryName} libraryInfo the library object
     * @param {any} libraryMetadata the library metadata
     * @param {boolean} restricted true if the library can only be installed with a special permission
     * @returns {IInstalledLibrary} the libray object (containing - among others - the id of the newly installed library)
     */
    private installLibrary;
    /**
     * Updates the library to a new version.
     * REMOVES THE LIBRARY IF THERE IS AN ERROR!!!
     * @param filesDirectory the path of the directory containing the library files to update to
     * @param library the library object
     * @param newLibraryMetadata the library metadata (library.json)
     */
    private updateLibrary;
}
