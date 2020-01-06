/// <reference types="node" />
import { Stream } from 'stream';
/**
 * Returns the contents of a stream as a string
 * @param {Stream} stream the stream to read
 * @returns {Promise<string>}
 */
export declare function streamToString(stream: Stream): Promise<string>;
