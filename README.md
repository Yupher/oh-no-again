# oh-no-again.js 😬

<p align="center">
  <img src="https://raw.githubusercontent.com/yupher/oh-no-again/main/logo.png" alt="oh-no-again.js logo" width="200"/>
</p>

A tiny and powerful retry + batching + timeout + abort utility for Node.js.  
Built from real-world frustration with unreliable APIs and network issues.

---

## ✨ Features

- ✅ Retry with exponential backoff
- ✅ Timeout with `AbortController` support (native `fetch`)
- ✅ Concurrency-limited batching (like `p-limit`)
- ✅ Built-in `fetch` under the hood — no need to install axios!
- ✅ Works out of the box with native `fetch`
- ✅ TypeScript support
- ✅ Dual ESM & CommonJS support (Node.js 22+)
- ✅ Improved error reporting (context-aware)
- ✅ Lifecycle hooks (onRetry, onAbort, onSuccess, onFailure, onBatchStart, onBatchComplete)

---

## 🚀 Installation

```bash
npm install oh-no-again
```

```js
// For CommonJS (Node.js 22+)
const { retryHelper, requestBatcher } = require('oh-no-again');

// For ESM (Node.js 22+)
import { retryHelper, requestBatcher } from 'oh-no-again';
```

---

## 📦 Usage

### 🔁 Retry a flaky `fetch()` request

```js
const { retryHelper } = require('oh-no-again');

const result = await retryHelper(
  async (signal) => {
    return await fetch('https://api.example.com/data', { signal });
  },
  {
    retries: 3, //number of retries if the request fails
    delay: 300, // delay between each retry it goes delay * 2 ** i
    timeout: 300, // ms: abort if request takes too long
    hooks: {
      onRetry: (err, attempt) =>
        console.warn(`Retry #${attempt + 1}:`, err.message),
      onAbort: (err) => console.warn('Aborted:', err.message),
      onFailure: (err) => console.error('Final failure:', err.message),
      onSuccess: (res) => console.log('Success:', res),
    },
  },
);
```

### 🚦 Batching with concurrency limit

```js
const { requestBatcher } = require('oh-no-again');

const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];

const result = await requestBatcher(
  users,
  2, // max 2 at a time
  (user) => ({
    url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }),
  {
    retries: 3, //number of retries if the request fails
    delay: 300, // delay between each retry it goes delay * 2 ** i
    timeout: 300, // ms: abort if request takes too long
    returnMeta: true, // if true return [{success: true|false, item, result|error}] else [{result|null}]
    failFast: false, // if true it thorws an error if at least one failed
    hooks: {
      onBatchStart: (i, batch) =>
        console.log(`Starting batch #${i + 1}`, batch),
      onBatchComplete: (i, results) =>
        console.log(`Completed batch #${i + 1}`, results),
      onRetry: (err, attempt) =>
        console.warn(`Retry #${attempt + 1}:`, err.message),
      onAbort: (err) => console.warn('Aborted:', err.message),
      onFailure: (err) => console.error('Final failure:', err.message),
      onSuccess: (res) => console.log('Success:', res),
    },
  },
);
```

---

## ⚙️ API

### `retryHelper(fn, options)`

| Param     | Type                          | Description                             |
| --------- | ----------------------------- | --------------------------------------- |
| `fn`      | `(signal) => Promise<any>`    | Your async function that accepts signal |
| `options` | `{ retries, delay, timeout }` | Optional retry config                   |

### `requestBatcher(array, concurrency, taskFn, options)`

| Param         | Type                                                | Description                     |
| ------------- | --------------------------------------------------- | ------------------------------- |
| `array`       | `Array`                                             | Items to process                |
| `concurrency` | `number`                                            | Max parallel operations         |
| `taskFn`      | `(item) => TaskRequest`                             | Function returning fetch config |
| `options`     | `{ retries, delay, timeout, returnMeta, failFast }` | Optional retry config           |

---

### TaskRequest

```ts
{
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}
```

## 🧠 Requirements

- Node.js v22.0.0 or higher

## 🆕 Changelog

### v0.3.0

- ✅ Added lifecycle event hooks:
  - onRetry, onAbort, onFailure, onSuccess
  - onBatchStart, onBatchComplete
- ✅ Improved JSDoc style annotations
- ✅ Full TypeScript definition update (oh-no-again.d.ts)
- ✅ Enhanced metadata control: failFast, returnMeta

### v0.2.1

- ✅ Added TypeScript support with .d.ts file
- ✅ Added dual module support: CommonJS + ESM
- 🔧 Internal refactor to support fetch abstraction
- 🛠 Improved API docs

### v0.2.0

- ✅ Added TypeScript typings (`oh-no-again.d.ts`)
- ✅ Improved function doc annotations for better IntelliSense

### v0.1.0

- 🎉 Initial release with:
  - Retry logic with backoff
  - Timeout + AbortController
  - requestBatcher with concurrency

---

## 🧪 Roadmap

- ✅ Native fetch support
- ⏳ Axios support (dropped, may revisit)
- ✅ TypeScript typings
- ⏳ CLI version
- ✅ Dual ESM + CJS support
- ✅ Event hooks support

## 🧑‍💻 Author

**Bouhadjila Hamza** — Built with ☕, frustration, and late-night debugging.

## 🪪 License

MIT

## 💡 Name origin

_"Oh no… not again."_ — You, every time a flaky request fails in production.
