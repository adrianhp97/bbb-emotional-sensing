import { IEditorConfig, IKeyValueStorage } from '../../src';
/**
 * Stores configuration options and literals that are used throughout the system.
 * Also loads and saves the configuration of changeable values (only those as "user-configurable") in the storage object.
 */
export default class EditorConfig implements IEditorConfig {
    /**
     * @param {IStorage} storage A key-value storage object that persists the changes to the disk or gets them from the implementation/plugin
     */
    constructor(storage: IKeyValueStorage);
    ajaxPath: string;
    baseUrl: string;
    /**
     * Time after which the content type cache is considered to be outdated in milliseconds.
     * User-configurable.
     */
    contentTypeCacheRefreshInterval: number;
    /**
     * A list of file extensions allowed for content files. (Extensions separated by whitespaces)
     */
    contentWhitelist: string;
    /**
     * This is the version of the H5P Core (JS + CSS) that is used by this implementation.
     * It is sent to the H5P Hub when registering there.
     * Not user-configurable and should not be changed by custom implementations.
     */
    coreApiVersion: {
        major: number;
        minor: number;
    };
    /**
     * If set to true, the content types that require a Learning Record Store to make sense are
     * offered as a choice when the user creates new content.
     * User-configurable.
     */
    enableLrsContentTypes: boolean;
    /**
     * Unclear. Taken over from PHP implementation and sent to the H5P Hub when registering the site.
     * User-configurable.
     */
    fetchingDisabled: 0 | 1;
    /**
     * This is where the client will look for image, video etc. files added to content.
     * WARNING: Do not change the 'content' part of the URL, as the editor client assumes that it can find
     * content under this path!
     */
    filesPath: string;
    /**
     * This is the version of the PHP implementation that the NodeJS implementation imitates.
     * It is sent to the H5P Hub when registering there.
     * Not user-configurable and should not be changed by custom implementations.
     */
    h5pVersion: string;
    /**
     * Called to fetch information about the content types available at the H5P Hub.
     * User-configurable.
     */
    hubContentTypesEndpoint: string;
    /**
     * Called to register the running instance at the H5P Hub.
     * User-configurable.
     */
    hubRegistrationEndpoint: string;
    /**
     * The EDITOR LIBRARY FILES are loaded from here (needed for the ckeditor), NOT
     * the libraries itself.
     */
    libraryUrl: string;
    /**
     * A list of file extensions allowed for library files.
     * (All extensions allowed for content files are also automatically allowed for libraries).
     */
    libraryWhitelist: string;
    /**
     * The list of content types that are enabled when enableLrsContentTypes is set to true.
     * Not user-configurable.
     */
    lrsContentTypes: string[];
    /**
     * The maximum allowed file size of content and library files (in bytes).
     */
    maxFileSize: number;
    /**
     * The maximum allowed file size of all content and library files in an uploaded h5p package (in bytes).
     */
    maxTotalSize: number;
    /**
     * This is the name of the H5P implementation sent to the H5P for statistical reasons.
     * Not user-configurable but should be overridden by custom custom implementations.
     */
    platformName: string;
    /**
     * This is the version of the H5P implementation sent to the H5P when registering the site.
     * Not user-configurable but should be overridden by custom custom implementations.
     */
    platformVersion: string;
    /**
     * If true, the instance will send usage statistics to the H5P Hub whenever it looks for new content types or updates.
     * User-configurable.
     */
    sendUsageStatistics: boolean;
    /**
     * Indicates on what kind of network the site is running. Can be "local", "network" or "internet".
     * TODO: This value should not be user-configurable, but has to be determined by the system on startup.
     * (If possible.)
     */
    siteType: 'local' | 'network' | 'internet';
    /**
     * Temporary files will be deleted after this time. (in milliseconds)
     */
    temporaryFileLifetime: number;
    /**
     * The URL path of temporary file storage (used for image, video etc. uploads of
     * unsaved content).
     */
    temporaryFilesPath: string;
    /**
     * Used to identify the running instance when calling the H5P Hub.
     * User-configurable, but also automatically set when the Hub is first called.
     */
    uuid: string;
    private storage;
    /**
     * Loads all changeable settings from storage. (Should be called when the system initializes.)
     */
    load(): Promise<EditorConfig>;
    /**
     * Saves all changeable settings to storage. (Should be called when a setting was changed.)
     */
    save(): Promise<void>;
    /**
     * Loads a settings from the storage interface. Uses the default value configured in this file if there is none in the configuration.
     * @param settingName
     * @returns the value of the setting
     */
    private loadSettingFromStorage;
    /**
     * Saves a setting to the storage interface.
     * @param settingName
     */
    private saveSettingToStorage;
}
