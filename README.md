# oh-no-again.js 😬

A tiny and powerful **retry + batching + timeout + abort** utility for Node.js.  
Built from real-world frustration with unreliable APIs and network issues.

---

## ✨ Features

- ✅ Retry with exponential backoff
- ✅ Timeout with `AbortController` support (native `fetch`)
- ✅ Concurrency-limited batching (like `p-limit`)
- ✅ Works out of the box with `fetch`
- ✅ Supports both CommonJS and ESM (soon)
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

const result = await retryHelper(3, 200, 1000, async (signal) => {
  return await fetch('https://api.example.com/data', { signal });
});
```

---

### 🚦 Batching with concurrency limit

```js
const { requestBatcher } = require('oh-no-again');

const ids = [1, 2, 3, 4, 5];

const users = await requestBatcher(
  ids,
  2, // Max 2 parallel fetches at a time
  (id, i, signal) =>
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { signal }).then(
      (res) => res.json(),
    ),
  {
    retries: 3,
    delay: 200,
    timeout: 1000,
  },
);
```

---

## ⚙️ API

### `retryHelper(retries, delay, timeout, fn)`

| Param     | Type               | Description                             |
| --------- | ------------------ | --------------------------------------- |
| `retries` | `number`           | Max retry attempts                      |
| `delay`   | `number`           | Base delay (ms) between retries         |
| `timeout` | `number`           | Abort timeout per request (ms)          |
| `fn`      | `Function(signal)` | Your async function using `AbortSignal` |

---

### `requestBatcher(array, concurrency, taskFn, options)`

| Param         | Type                           | Description             |
| ------------- | ------------------------------ | ----------------------- |
| `array`       | `Array`                        | Items to process        |
| `concurrency` | `number`                       | Max parallel operations |
| `taskFn`      | `(item, i, signal) => Promise` | Your async handler      |
| `options`     | `{ retries, delay, timeout }`  | Optional retry config   |

---

## 🔮 Roadmap

- ✅ Native `fetch` support
- 🚧 Axios support with cancel token
- 🚧 TypeScript typings
- 🚧 CLI version
- 🚧 Dual `ESM` + `CJS` export
- 🚧 Event hooks (`onRetry`, `onAbort`, etc.)

---

## 🧑‍💻 Author

**Bouhadjila Hamza**  
Made with ☕ and pain in the real world.

---

## 🪪 License

MIT

---

## 💡 Name Origin

> _"Oh no… not again."_ — You, every time a flaky request fails in production.
