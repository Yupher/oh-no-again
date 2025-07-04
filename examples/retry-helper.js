const { retryHelper } = require('..');

(async () => {
  try {
    const result = await retryHelper(
      (signal) =>
        fetch('https://jsonplaceholder.typicode.com/users/1', { signal }),
      {
        retries: 3,
        delay: 100,
        timeout: 50,
      },
    );

    console.log(await result.json());
  } catch (error) {
    console.log(error.message);
  }
})();
