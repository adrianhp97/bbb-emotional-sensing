/// <reference types="node" />
import { ReadStream, WriteStream } from 'fs';
import ContentManager from './ContentManager';
import ContentTypeCache from './ContentTypeCache';
import LibraryManager from './LibraryManager';
import PackageImporter from './PackageImporter';
import TemporaryFileManager from './TemporaryFileManager';
import TranslationService from './TranslationService';
import { ContentId, ContentParameters, IContentMetadata, IContentStorage, IEditorConfig, IKeyValueStorage, ILibraryDetailedDataForClient, ILibraryFileUrlResolver, ILibraryOverviewForClient, ILibraryStorage, ISemanticsEntry, ITemporaryFileStorage, IUser } from './types';
export default class H5PEditor {
    config: IEditorConfig;
    constructor(keyValueStorage: IKeyValueStorage, config: IEditorConfig, libraryStorage: ILibraryStorage, contentStorage: IContentStorage, translationService: TranslationService, 
    /**
     * This function returns the (relative) URL at which a file inside a library
     * can be accessed. It is used when URLs of library files must be inserted
     * (hard-coded) into data structures. The implementation must do this file ->
     * URL resolution, as it decides where the files can be accessed.
     */
    libraryFileUrlResolver: ILibraryFileUrlResolver, temporaryStorage: ITemporaryFileStorage);
    contentManager: ContentManager;
    contentTypeCache: ContentTypeCache;
    libraryManager: LibraryManager;
    packageImporter: PackageImporter;
    temporaryFileManager: TemporaryFileManager;
    translationService: TranslationService;
    private ajaxPath;
    private baseUrl;
    private contentStorer;
    private contentTypeRepository;
    private filesPath;
    private libraryUrl;
    private packageExporter;
    private renderer;
    private translation;
    /**
     * Creates a .h5p-package for the specified content file and pipes it to the stream.
     * Throws H5pErrors if something goes wrong. The contents of the stream should be disregarded then.
     * @param contentId The contentId for which the package should be created.
     * @param outputStream The stream that the package is written to (e.g. the response stream fo Express)
     */
    exportPackage(contentId: ContentId, outputStream: WriteStream, user: IUser): Promise<void>;
    /**
     * Returns a stream for a file that was uploaded for a content object.
     * The requested content file can be a temporary file uploaded for unsaved content or a
     * file in permanent content storage.
     * @param contentId the content id (undefined if retrieved for unsaved content)
     * @param filename the file to get (without 'content/' prefix!)
     * @param user the user who wants to retrieve the file
     * @returns a stream of the content file
     */
    getContentFileStream(contentId: ContentId, filename: string, user: IUser): Promise<ReadStream>;
    getContentTypeCache(user: IUser): Promise<any>;
    getLibraryData(machineName: string, majorVersion: string, minorVersion: string, language?: string): Promise<ILibraryDetailedDataForClient>;
    /**
     * Retrieves the installed languages for libraries
     * @param libraryNames A list of libraries for which the language files should be retrieved.
     *                     In this list the names of the libraries don't use hyphens to separate
     *                     machine name and version.
     * @param language the language code to get the files for
     * @returns The strings of the language files
     */
    getLibraryLanguageFiles(libraryNames: string[], language: string): Promise<{
        [key: string]: string;
    }>;
    getLibraryOverview(libraryNames: string[]): Promise<ILibraryOverviewForClient[]>;
    /**
     * Determines the main library and returns the ubername for it (e.g. "H5P.Example 1.0").
     * @param metadata the metadata object (=h5p.json)
     * @returns the ubername with a whitespace as separator
     */
    getUbernameFromMetadata(metadata: IContentMetadata): string;
    /**
     * Installs a content type from the H5P Hub.
     * @param {string} id The name of the content type to install (e.g. H5P.Test-1.0)
     * @returns {Promise<true>} true if successful. Will throw errors if something goes wrong.
     */
    installLibrary(id: string, user: IUser): Promise<boolean>;
    loadH5P(contentId: ContentId, user?: IUser): Promise<{
        h5p: IContentMetadata;
        library: string;
        params: {
            metadata: IContentMetadata;
            params: ContentParameters;
        };
    }>;
    render(contentId: ContentId): Promise<string>;
    /**
     * Stores an uploaded file in temporary storage.
     * @param contentId the id of the piece of content the file is attached to; Set to null/undefined if
     * the content hasn't been saved before.
     * @param field the semantic structure of the field the file is attached to.
     * @param file information about the uploaded file
     */
    saveContentFile(contentId: ContentId, field: ISemanticsEntry, file: {
        data: Buffer;
        mimetype: string;
        name: string;
        size: number;
    }, user: IUser): Promise<{
        mime: string;
        path: string;
    }>;
    /**
     * Stores new content or updates existing content.
     * Copies over files from temporary storage if necessary.
     * @param contentId the contentId of existing content (undefined or previously unsaved content)
     * @param parameters the content parameters (=content.json)
     * @param metadata the content metadata (~h5p.json)
     * @param mainLibraryName the ubername with whitespace as separator (no hyphen!)
     * @param user the user who wants to save the piece of content
     * @returns the existing contentId or the newly assigned one
     */
    saveH5P(contentId: ContentId, parameters: ContentParameters, metadata: IContentMetadata, mainLibraryName: string, user: IUser): Promise<ContentId>;
    setAjaxPath(ajaxPath: string): H5PEditor;
    /**
     * Adds the contents of a package to the system: Installs required libraries (if
     * the user has the permissions for this), adds files to temporary storage and
     * returns the actual content information for the editor to process.
     * Throws errors if something goes wrong.
     * @param data the raw data of the h5p package as a buffer
     * @returns the content information extracted from the package
     */
    uploadPackage(data: Buffer, user: IUser): Promise<{
        metadata: IContentMetadata;
        parameters: any;
    }>;
    useRenderer(renderer: any): H5PEditor;
    private coreScripts;
    private coreStyles;
    private editorIntegration;
    private findLibraries;
    private generateH5PJSON;
    private integration;
    private loadAssets;
    private resolveDependencies;
}
