"use strict";
exports.__esModule = true;
/**
 * Returns the contents of a stream as a string
 * @param {Stream} stream the stream to read
 * @returns {Promise<string>}
 */
function streamToString(stream) {
    /* from https://stackoverflow.com/questions/10623798/read-contents-of-node-js-stream-into-a-string-variable */
    var chunks = [];
    return new Promise(function (resolve, reject) {
        stream.on('data', function (chunk) { return chunks.push(chunk); });
        stream.on('error', reject);
        stream.on('end', function () { return resolve(Buffer.concat(chunks).toString('utf8')); });
    });
}
exports.streamToString = streamToString;
//# sourceMappingURL=StreamHelpers.js.map