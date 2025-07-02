/**
 * Splits an array into chunks of a given size.
 * @param {Array} array - The full array to split.
 * @param {number} size - Number of items per batch.
 * @returns {Array[]} - An array of arrays (batches).
 * @throws {TypeError} if arguments are invalid.
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
