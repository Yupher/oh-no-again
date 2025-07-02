const { requestBatcher } = require('../src');

//const fetch = require('node-fetch'); // use `undici` or `node-fetch` in Node.js if needed

const USERS = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, ..., 10]

async function fetchUser(id, signal) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}: ${response.status}`);
  }

  return response.json();
}

(async () => {
  try {
    const users = await requestBatcher(
      USERS,
      3, // concurrency: 3 users at a time
      async (id, i, signal) => {
        return await fetchUser(id, signal);
      },
      {
        retries: 3,
        delay: 300,
        timeout: 300, // ms: abort if request takes too long
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
