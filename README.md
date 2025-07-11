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
- ✅ Conditional skipping (`taskFn => false`)
- ✅ CLI tool to batch HTTP requests from a file

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
  (user) =>
    user.id === 6
      ? false /*id 6  will be skipped*/
      : {
          url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
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

## 🧪 CLI Usage

Run batch HTTP requests from a `.json` input file using `oha`:

```bash
npx oha --input users.json --url "https://api.example.com/users/{{item.id}}"
```

Where `users.json` contains an array of objects:

```json
[{ "id": 1 }, { "id": 2 }]
```

### Available Options:

- `--input` Path to the input JSON file
- `--url` URL template with `{{variable}}` placeholders
- `--concurrency` Max parallel requests (default: 5)
- `--retries` Retry attempts per request (default: 3)
- `--delay` Initial delay between retries (ms)
- `--timeout` Request timeout in milliseconds
- `--meta` Return full result with status and error info
- `--fail-fast` Stop on first error

```bash
npx oha --input users.json --url "https://api.example.com/users/{{id}}" --meta
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
|               |                                                     | or false to skip                |
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

### v0.4.0

- ✅ Added support for **conditional skipping** via `taskFn` returning `false`
- ✅ Included **HTTP status code** in batch result metadata
- ✅ Added `skipped: true` in meta if task is skipped
- ✅ Improved `.d.ts` TypeScript typings
- ✅ Introduced **CLI tool** to run batch fetches from JSON files
- ✅ Added CLI tests (`cli.test.js`)
- ✅ Setup GitHub Actions to run tests before merging to main
- 🧪 Improved test coverage and automated validation flow

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
