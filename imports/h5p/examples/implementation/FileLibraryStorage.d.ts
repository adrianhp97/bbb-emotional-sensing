/// <reference types="node" />
import { ReadStream } from 'fs-extra';
import { Stream } from 'stream';
import { IInstalledLibrary, ILibraryMetadata, ILibraryName, ILibraryStorage } from '../../src';
/**
 * Stores libraries in a directory.
 */
export default class FileLibraryStorage implements ILibraryStorage {
    /**
     * @param {string} librariesDirectory The path of the directory in the file system at which libraries are stored.
     */
    constructor(librariesDirectory: string);
    private librariesDirectory;
    /**
     * Adds a library file to a library. The library metadata must have been installed with installLibrary(...) first.
     * Throws an error if something unexpected happens.
     * @param {ILibraryName} library The library that is being installed
     * @param {string} filename Filename of the file to add, relative to the library root
     * @param {Stream} stream The stream containing the file content
     * @returns {Promise<boolean>} true if successful
     */
    addLibraryFile(library: ILibraryName, filename: string, stream: Stream): Promise<boolean>;
    /**
     * Removes all files of a library. Doesn't delete the library metadata. (Used when updating libraries.)
     * @param {ILibraryName} library the library whose files should be deleted
     * @returns {Promise<void>}
     */
    clearLibraryFiles(library: ILibraryName): Promise<void>;
    /**
     * Check if the library contains a file
     * @param {ILibraryName} library The library to check
     * @param {string} filename
     * @returns {Promise<boolean>} true if file exists in library, false otherwise
     */
    fileExists(library: ILibraryName, filename: string): Promise<boolean>;
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param {ILibraryName} library library
     * @param {string} filename the relative path inside the library
     * @returns {Promise<Stream>} a readable stream of the file's contents
     */
    getFileStream(library: ILibraryName, filename: string): ReadStream;
    /**
     * Returns all installed libraries or the installed libraries that have the machine names in the arguments.
     * @param  {...string[]} machineNames (optional) only return libraries that have these machine names
     * @returns {Promise<ILibraryName[]>} the libraries installed
     */
    getInstalled(...machineNames: string[]): Promise<ILibraryName[]>;
    /**
     * Gets a list of installed language files for the library.
     * @param {ILibraryName} library The library to get the languages for
     * @returns {Promise<string[]>} The list of JSON files in the language folder (without the extension .json)
     */
    getLanguageFiles(library: ILibraryName): Promise<string[]>;
    /**
     * Adds the metadata of the library to the repository.
     * Throws errors if something goes wrong.
     * @param {ILibraryMetadata} libraryMetadata The library metadata object (= content of library.json)
     * @param {boolean} restricted True if the library can only be used be users allowed to install restricted libraries.
     * @returns {Promise<IInstalledLibrary>} The newly created library object to use when adding library files with addLibraryFile(...)
     */
    installLibrary(libraryMetadata: ILibraryMetadata, restricted?: boolean): Promise<IInstalledLibrary>;
    /**
     * Checks if the library has been installed.
     * @param name the library name
     * @returns true if the library has been installed
     */
    libraryExists(name: ILibraryName): Promise<boolean>;
    /**
     * Gets a list of all library files that exist for this library.
     * @param {ILibraryName} library
     * @returns {Promise<string[]>} all files that exist for the library
     */
    listFiles(library: ILibraryName): Promise<string[]>;
    /**
     * Removes the library and all its files from the repository.
     * Throws errors if something went wrong.
     * @param {ILibraryName} library The library to remove.
     * @returns {Promise<void>}
     */
    removeLibrary(library: ILibraryName): Promise<void>;
    /**
     * Updates the library metadata.
     * This is necessary when updating to a new patch version.
     * You also need to call clearLibraryFiles(...) to remove all old files during the update process and addLibraryFile(...)
     * to add the files of the patch.
     * @param {ILibraryMetadata} libraryMetadata the new library metadata
     * @returns {Promise<IInstalledLibrary>} The updated library object
     */
    updateLibrary(libraryMetadata: ILibraryMetadata): Promise<IInstalledLibrary>;
    /**
     * Gets the directory path of the specified library.
     * @param {ILibraryName} library
     * @returns {string} the absolute path to the directory
     */
    private getDirectoryPath;
    /**
     * Gets the path of any file of the specified library.
     * @param {ILibraryName} library
     * @param {string} filename
     * @returns {string} the absolute path to the file
     */
    private getFullPath;
}
