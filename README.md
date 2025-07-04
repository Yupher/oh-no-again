# oh-no-again.js 😬

A tiny and powerful retry + batching + timeout + abort utility for Node.js.  
Built from real-world frustration with unreliable APIs and network issues.

---

## ✨ Features

- ✅ Retry with exponential backoff
- ✅ Timeout with `AbortController` support (native `fetch`)
- ✅ Concurrency-limited batching (like `p-limit`)
- ✅ Works out of the box with `fetch`
- ✅ TypeScript support (as of v0.2.0)
- ✅ Tiny and dependency-free

---

## 🚀 Installation

```bash
npm install oh-no-again
```

---

## 📦 Usage

### 🔁 Retry a flaky `fetch()` request

```js
const { retryHelper } = require('oh-no-again');

const result = await retryHelper(async (signal) => {
  return await fetch('https://api.example.com/data', { signal });
});
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
  }),
  {
    retries: 3,
    delay: 200,
    timeout: 1000,
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

| Param         | Type                          | Description                     |
| ------------- | ----------------------------- | ------------------------------- |
| `array`       | `Array`                       | Items to process                |
| `concurrency` | `number`                      | Max parallel operations         |
| `taskFn`      | `(item) => TaskRequest`       | Function returning fetch config |
| `options`     | `{ retries, delay, timeout }` | Optional retry config           |

---

## 🆕 Changelog

### v0.2.0

- ✅ Added TypeScript typings (`oh-no-again.d.ts`)
- ✅ Improved function doc annotations for better IntelliSense

### v0.1.0

- 🎉 Initial release with:
  - Retry logic with backoff
  - Timeout + AbortController
  - requestBatcher with concurrency

---

- ✅ Native fetch support
- ⏳ Axios support (dropped, may revisit)
- ✅ TypeScript typings
- ⏳ CLI version
- ⏳ Dual ESM + CJS support
- ⏳ Event hooks (`onRetry`, `onAbort`, etc.)

## 🧑‍💻 Author

**Bouhadjila Hamza** — Built with ☕, frustration, and late-night debugging.

## 🪪 License

MIT

## 💡 Name origin

_"Oh no… not again."_ — You, every time a flaky request fails in production.
