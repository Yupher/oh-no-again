/**
 * Splits an array into smaller chunks (batches) of a given size.
 *
 * @template T
 * @param {T[]} array - The input array to split.
 * @param {number} size - The number of items per batch (must be > 0).
 * @returns {T[][]} An array of batches (arrays of items).
 * @throws {TypeError} If input is not an array or size is not a positive number.
 */
function createBatches(array, size) {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array as the first argument');
  }

  if (typeof size !== 'number' || size <= 0) {
    throw new TypeError('Expected a positive number as the second argument');
  }

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// CommonJS export
module.exports = {
  createBatches,
};
