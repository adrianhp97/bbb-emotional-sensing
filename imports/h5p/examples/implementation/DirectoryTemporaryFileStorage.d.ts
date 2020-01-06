/// <reference types="node" />
import { ReadStream } from 'fs';
import { ITemporaryFile, ITemporaryFileStorage, IUser } from '../../src';
/**
 * Stores temporary files in directories on the disk.
 * Manages access rights by creating one sub-directory for each user.
 * Manages expiration times by creating companion '.metadata' files for every
 * file stored.
 */
export default class DirectoryTemporaryFileStorage implements ITemporaryFileStorage {
    private directory;
    /**
     * @param directory the directory in which the temporary files are stored.
     * Must be read- and write accessible
     */
    constructor(directory: string);
    deleteFile(filename: string, userId: string): Promise<void>;
    fileExists(filename: string, user: IUser): Promise<boolean>;
    getFileStream(filename: string, user: IUser): Promise<ReadStream>;
    listFiles(user?: IUser): Promise<ITemporaryFile[]>;
    saveFile(filename: string, dataStream: ReadStream, user: IUser, expirationTime: Date): Promise<ITemporaryFile>;
    private getTemporaryFileInfo;
}
