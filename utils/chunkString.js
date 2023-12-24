/**
 * Divide a string into chunks of n characters
 *
 * @param {string} str String to divide
 * @param {number} n Number of characters per chunk
 * @param {string[]} acc Array to store the chunks
 * @returns {string[]} Array of chunks
 */
export function chunkString(str, n, acc) {
 if (str.length === 0) return acc;

 acc.push(str.substring(0, n));
 return chunkString(str.substring(n), n, acc);
}
