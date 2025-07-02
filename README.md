# oh-no-again.js

> A retry, timeout, and abort helper for async operations. Built for fetch, axios, and batch-safe retries.

## Usage

```js
const { createBatches } = require('oh-no-again');

const list = [1, 2, 3, 4, 5];
const batches = createBatches(list, 2);
console.log(batches); // [[1,2], [3,4], [5]]
```
