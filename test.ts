import { retryHelper, requestBatcher } from './index.js';

retryHelper((signal) => {
  return fetch('https://jsonplaceholder.typicode.com/users/1', { signal });
}).then();

requestBatcher(
  [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  2,
  ({ id }) => ({
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
  }),
  {
    retries: 2,
    timeout: 300,
    hooks: {
      onBatchStart: (i, batch) => console.log(i, batch),
    },
  },
).then(console.log);
