import { IInstalledLibrary, ILibraryMetadata, ILibraryName, IPath } from './types';
/**
 * Stores information about installed H5P libraries.
 */
export default class InstalledLibrary implements IInstalledLibrary {
    machineName: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    restricted: boolean;
    constructor(machineName: string, majorVersion: number, minorVersion: number, patchVersion: number, restricted?: boolean);
    author?: string;
    coreApi?: {
        majorVersion: number;
        minorVersion: number;
    };
    description?: string;
    dropLibraryCss?: {
        machineName: string;
    }[];
    dynamicDependencies?: ILibraryName[];
    editorDependencies?: ILibraryName[];
    embedTypes?: ('iframe' | 'div')[];
    fullscreen?: 0 | 1;
    h?: number;
    license?: string;
    metadataSettings?: {
        disable: 0 | 1;
        disableExtraTitleField: 0 | 1;
    };
    preloadedCss?: IPath[];
    preloadedDependencies?: ILibraryName[];
    preloadedJs?: IPath[];
    runnable: boolean;
    title: string;
    w?: number;
    static fromMetadata(name: ILibraryMetadata): InstalledLibrary;
    static fromName(name: ILibraryName): InstalledLibrary;
    /**
     * Compares libraries by giving precedence to title, then major version, then minor version
     * @param otherLibrary
     */
    compare(otherLibrary: InstalledLibrary): number;
    /**
     * Compares libraries by giving precedence to major version, then minor version, then patch version.
     * @param otherLibrary
     */
    compareVersions(otherLibrary: InstalledLibrary): number;
}
