import { ILibraryName } from './types';
export default class LibraryName implements ILibraryName {
    machineName: string;
    majorVersion: number;
    minorVersion: number;
    constructor(machineName: string, majorVersion: number, minorVersion: number);
    /**
     * Checks if two libraries are identical.
     * @param library1
     * @param library2
     */
    static equal(library1: ILibraryName, library2: ILibraryName): boolean;
    /**
     * Creates a library object from a library name
     * @param {string} libraryName The library name in a format "H5P.Example-1.0" or "H5P.Example 1.0" (see options)
     * @param {boolean} restricted true if the library is restricted
     * @param {boolean} useWhitespace true if the parser should accept names like "H5P.Library 1.0"
     * @param {boolean} useHyphen true if the parser should accept names like "H5P.Library-1.0"
     * @returns {Library} undefined if the name could not be parsed
     */
    static fromUberName(libraryName: string, options?: {
        useHyphen?: boolean;
        useWhitespace?: boolean;
    }): ILibraryName;
    /**
     * Returns the directory name that is used for this library (e.g. H5P.ExampleLibrary-1.0)
     */
    static toUberName(libraryName: ILibraryName, options?: {
        useHyphen?: boolean;
        useWhitespace?: boolean;
    }): string;
}
