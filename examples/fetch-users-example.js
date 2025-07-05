const { requestBatcher } = require('../index');

//const fetch = require('node-fetch'); // use `undici` or `node-fetch` in Node.js if needed

const USERS = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
})); // [1, 2, ..., 10]

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
      (user) => {
        return {
          url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
      },
      {
        retries: 3,
        delay: 300,
        timeout: 100, // ms: abort if request takes too long
        returnMeta: true,
        failFast: false,
      },
    );

    console.log('Fetched users:', users);
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
})();
