/// <reference types="node" />
import { WriteStream } from 'fs';
import ContentManager from './ContentManager';
import LibraryManager from './LibraryManager';
import { ContentId, IEditorConfig, ITranslationService, IUser } from './types';
/**
 * Offers functionality to create .h5p files from content that is stored in the system.
 */
export default class PackageExporter {
    private libraryManager;
    private translationService;
    private config;
    private contentManager;
    /**
     * @param {LibraryManager} libraryManager
     * @param {TranslationService} translationService
     * @param {EditorConfig} config
     * @param {ContentManager} contentManager (optional) Only needed if you want to use the PackageExporter to copy content from a package (e.g. Upload option in the editor)
     */
    constructor(libraryManager: LibraryManager, translationService: ITranslationService, config: IEditorConfig, contentManager?: ContentManager);
    /**
     * Creates a .h5p-package for the specified content file and pipes it to the stream.
     * Throws H5pErrors if something goes wrong. The contents of the stream should be disregarded then.
     * @param contentId The contentId for which the package should be created.
     * @param outputStream The stream that the package is written to (e.g. the response stream fo Express)
     */
    createPackage(contentId: ContentId, outputStream: WriteStream, user: IUser): Promise<void>;
    /**
     * Adds the files inside the content directory to the zip file. Does not include content.json!
     */
    private addContentFiles;
    /**
     * Adds the library files to the zip file that are required for the content to be playable.
     */
    private addLibraryFiles;
    /**
     * Checks if a piece of content exists and if the user has download permissions for it.
     * Throws an exception with the respective error message if this is not the case.
     */
    private checkAccess;
    /**
     * Creates a readable stream for the content.json file
     */
    private createContentFileStream;
    /**
     * Gets the metadata for the piece of content (h5p.json) and also creates a file stream for it.
     */
    private getMetadata;
}
