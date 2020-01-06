/// <reference types="node" />
import { ReadStream } from 'fs';
import { IEditorConfig, ITemporaryFileStorage, IUser } from './types';
/**
 * Keeps track of temporary files (images, video etc. upload for unsaved content).
 */
export default class TemporaryFileManager {
    private storage;
    private config;
    /**
     * @param config Used to get values for how long temporary files should be stored.
     */
    constructor(storage: ITemporaryFileStorage, config: IEditorConfig);
    /**
     * Removes temporary files that have expired.
     */
    cleanUp(): Promise<void>;
    /**
     * Removes a file from temporary storage. Will silently do nothing if the file does not
     * exist or is not accessible.
     * @param filename
     * @param user
     */
    deleteFile(filename: string, user: IUser): Promise<void>;
    /**
     * Returns a file stream for temporary file.
     * Will throw H5PError if the file doesn't exist or the user has no access permissions!
     * Make sure to close this stream. Otherwise the temporary files can't be deleted properly!
     * @param filename the file to get
     * @param user the user who requests the file
     * @returns a stream to read from
     */
    getFileStream(filename: string, user: IUser): Promise<ReadStream>;
    /**
     * Saves a file to temporary storage. Assigns access permission to the
     * user passed as an argument only.
     * @param filename the original filename of the file to store
     * @param dataStream the data of the file in a readable stream
     * @param user the user who requests the file
     * @returns the new filename (not equal to the filename passed to the
     * method to unsure uniqueness)
     */
    saveFile(filename: string, dataStream: ReadStream, user: IUser): Promise<string>;
    /**
     * Tries generating a unique filename for the file by appending a
     * id to it. Checks in storage if the filename already exists and
     * tries again if necessary.
     * Throws an H5PError if no filename could be determined.
     * @param filename the filename to check
     * @param user the user who is saving the file
     * @returns the unique filename
     */
    private generateUniqueName;
}