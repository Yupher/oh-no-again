import { retryHelper, requestBatcher } from './oh-no-again';

retryHelper((signal) => {
  return fetch('https://jsonplaceholder.typicode.com/users/1', { signal });
}).then();

requestBatcher(
  [1, 2, 3],
  2,
  (id) => ({
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
  }),
  { retries: 2 },
).then(console.log);
