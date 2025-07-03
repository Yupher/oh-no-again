# oh-no-again.js 😬

A tiny and powerful retry + batching + timeout + abort utility for Node.js.  
Built from real-world frustration with unreliable APIs and network issues.

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

## 📦 Usage

### 🔁 Retry a flaky fetch request

```js
const { retryHelper } = require('oh-no-again');

try {
  const result = await retryHelper(
    (signal) =>
      fetch('https://jsonplaceholder.typicode.com/users/1', { signal }),
    {
      retries: 3,
      delay: 100,
      timeout: 200,
    },
  );

  console.log(await result.json());
} catch (error) {
  console.log(error.message);
}
```

---

### 🚦 Batching with concurrency limit

```js
const { requestBatcher } = require('oh-no-again');

const USERS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];

(async () => {
  try {
    const users = await requestBatcher(
      USERS,
      3, // Max 3 requests at once
      (user) => ({
        url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        retries: 3,
        delay: 300,
        timeout: 400,
      },
    );

    console.log(
      'Fetched users:',
      users.map((u) => u.name),
    );
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
})();
```

---

## ⚙️ API

### `retryHelper(fn, options)`

| Param     | Type               | Description                                 |
| --------- | ------------------ | ------------------------------------------- |
| `fn`      | `Function(signal)` | Your async function using `AbortSignal`     |
| `options` | `object`           | Retry config: `{ retries, delay, timeout }` |

### `requestBatcher(array, concurrency, taskFn, options)`

| Param         | Type                          | Description                             |
| ------------- | ----------------------------- | --------------------------------------- |
| `array`       | `Array`                       | Items to process                        |
| `concurrency` | `number`                      | Max parallel operations                 |
| `taskFn`      | `(item) => RequestConfig`     | Returns { url, method, headers, body? } |
| `options`     | `{ retries, delay, timeout }` | Optional retry config                   |

---

## 🔮 Roadmap

- ✅ Native fetch support
- ⏳ Axios support (dropped, may revisit)
- ⏳ TypeScript typings
- ⏳ CLI version
- ⏳ Dual ESM + CJS support
- ⏳ Event hooks (`onRetry`, `onAbort`, etc.)

---

## 🧑‍💻 Author

**Bouhadjila Hamza**  
Made with ☕ and pain in the real world.

---

## 🪪 License

MIT

---

## 💡 Name origin

> "Oh no… not again." — You, every time a flaky request fails in production.
