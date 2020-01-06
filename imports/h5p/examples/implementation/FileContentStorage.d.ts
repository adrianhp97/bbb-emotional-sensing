/// <reference types="node" />
import { ReadStream } from 'fs';
import { Stream } from 'stream';
import { ContentId, IContentMetadata, IContentStorage, IUser, Permission } from '../../src';
/**
 * Persists content to the disk.
 */
export default class FileContentStorage implements IContentStorage {
    private contentPath;
    /**
     * @param {string} contentPath The absolute path to the directory where the content should be stored
     */
    constructor(contentPath: string);
    /**
     * Returns a random integer
     * @param {number} min The minimum
     * @param {number} max The maximum
     * @returns {number} a random integer
     */
    private static getRandomInt;
    /**
     * Adds a content file to an existing content object. The content object has to be created with createContent(...) first.
     * @param {ContentId} id The id of the content to add the file to
     * @param {string} filename The filename
     * @param {Stream} stream A readable stream that contains the data
     * @param {User} user The user who owns this object
     * @returns {Promise<void>}
     */
    addContentFile(id: ContentId, filename: string, stream: Stream, user: IUser): Promise<void>;
    /**
     * Checks if a piece of content exists in storage.
     * @param contentId the content id to check
     * @returns true if the piece of content exists
     */
    contentExists(contentId: ContentId): Promise<boolean>;
    /**
     * Checks if a file exists.
     * @param contentId The id of the content to add the file to
     * @param filename the filename of the file to get
     * @returns true if the file exists
     */
    contentFileExists(contentId: ContentId, filename: string): Promise<boolean>;
    /**
     * Creates a content object in the repository. Add files to it later with addContentFile(...).
     * Throws an error if something went wrong. In this case no traces of the content are left in storage and all changes are reverted.
     * @param {any} metadata The metadata of the content (= h5p.json)
     * @param {any} content the content object (= content/content.json)
     * @param {User} user The user who owns this object.
     * @param {ContentId} id (optional) The content id to use
     * @returns {Promise<ContentId>} The newly assigned content id
     */
    createContent(metadata: IContentMetadata, content: any, user: IUser, id?: ContentId): Promise<ContentId>;
    /**
     * Generates a unique content id that hasn't been used in the system so far.
     * @returns {Promise<ContentId>} A unique content id
     */
    createContentId(): Promise<ContentId>;
    /**
     * Deletes a content object and all its dependent files from the repository.
     * Throws errors if something goes wrong.
     * @param {ContentId} id The content id to delete.
     * @param {User} user The user who wants to delete the content
     * @returns {Promise<void>}
     */
    deleteContent(id: ContentId, user?: IUser): Promise<void>;
    /**
     * Deletes a file from a content object.
     * @param contentId the content object the file is attached to
     * @param filename the file to delete
     */
    deleteContentFile(contentId: ContentId, filename: string): Promise<void>;
    /**
     * Gets the filenames of files added to the content with addContentFile(...) (e.g. images, videos or other files)
     * @param contentId the piece of content
     * @param user the user who wants to access the piece of content
     * @returns a list of files that are used in the piece of content, e.g. ['image1.png', 'video2.mp4']
     */
    getContentFiles(contentId: ContentId, user: IUser): Promise<string[]>;
    /**
     * Returns a readable stream of a content file (e.g. image or video) inside a piece of content
     * @param {ContentId} id the id of the content object that the file is attached to
     * @param {string} filename the filename of the file to get
     * @param {User} user the user who wants to retrieve the content file
     * @returns {Stream}
     */
    getContentFileStream(id: ContentId, filename: string, user: IUser): ReadStream;
    /**
     * Returns an array of permissions that the user has on the piece of content
     * @param contentId the content id to check
     * @param user the user who wants to access the piece of content
     * @returns the permissions the user has for this content (e.g. download it, delete it etc.)
     */
    getUserPermissions(contentId: ContentId, user: IUser): Promise<Permission[]>;
    private checkFilename;
}
