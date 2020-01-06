import ContentManager from './ContentManager';
import ContentStorer from './ContentStorer';
import LibraryManager from './LibraryManager';
import { ContentId, IContentMetadata, IEditorConfig, ITranslationService, IUser } from './types';
/**
 * Handles the installation of libraries and saving of content from a H5P package.
 */
export default class PackageImporter {
    private libraryManager;
    private translationService;
    private config;
    private contentManager;
    private contentStorer;
    /**
     * @param {LibraryManager} libraryManager
     * @param {TranslationService} translationService
     * @param {EditorConfig} config
     * @param {ContentStorer} contentStorer
     */
    constructor(libraryManager: LibraryManager, translationService: ITranslationService, config: IEditorConfig, contentManager?: ContentManager, contentStorer?: ContentStorer);
    /**
     * Extracts a H5P package to the specified directory.
     * @param {string} packagePath The full path to the H5P package file on the local disk
     * @param {string} directoryPath The full path of the directory to which the package should be extracted
     * @param {boolean} includeLibraries If true, the library directories inside the package will be extracted.
     * @param {boolean} includeContent If true, the content folder inside the package will be extracted.
     * @param {boolean} includeMetadata If true, the h5p.json file inside the package will be extracted.
     * @returns {Promise<void>}
     */
    static extractPackage(packagePath: string, directoryPath: string, { includeLibraries, includeContent, includeMetadata }: {
        includeContent: boolean;
        includeLibraries: boolean;
        includeMetadata: boolean;
    }): Promise<void>;
    /**
     * Permanently adds content from a H5P package to the system. This means that
     * content is __permanently__ added to storage and necessary libraries are installed from the package
     * if they are not already installed.
     *
     * This is __NOT__ what you want if the user is just uploading a package in the editor client!
     *
     * Throws errors if something goes wrong.
     * @param packagePath The full path to the H5P package file on the local disk.
     * @param user The user who wants to upload the package.
     * @param contentId (optional) the content id to use for the package
     * @returns the newly assigned content id, the metadata (=h5p.json) and parameters (=content.json)
     * inside the package
     */
    addPackageLibrariesAndContent(packagePath: string, user: IUser, contentId?: ContentId): Promise<{
        id: ContentId;
        metadata: IContentMetadata;
        parameters: any;
    }>;
    /**
     * Copies files inside the package into temporary storage and installs the necessary libraries from the package
     * if they are not already installed. (This is what you want to do if the user uploads a package in the editor client.)
     * Pass the information returned about the content back to the editor client.
     * Throws errors if something goes wrong.
     * @param packagePath The full path to the H5P package file on the local disk.
     * @param user The user who wants to upload the package.
     * @returns the metadata and parameters inside the package
     */
    addPackageLibrariesAndTemporaryFiles(packagePath: string, user: IUser): Promise<{
        metadata: IContentMetadata;
        parameters: any;
    }>;
    /**
     * Installs all libraries from the package. Assumes that the user calling this has the permission to install libraries!
     * Throws errors if something goes wrong.
     * @param {string} packagePath The full path to the H5P package file on the local disk.
     * @returns {Promise<void>}
     */
    installLibrariesFromPackage(packagePath: string): Promise<void>;
    /**
     * Generic method to process a H5P package. Can install libraries and copy content.
     * @param packagePath The full path to the H5P package file on the local disk
     * @param installLibraries If true, try installing libraries from package. Defaults to false.
     * @param copyMode indicates if and how content should be installed
     * @param user (optional) the user who wants to copy content (only needed when copying content)
     * @returns the newly assigned content id (undefined if not saved permanently), the metadata (=h5p.json)
     * and parameters (=content.json) inside the package
     */
    private processPackage;
}
