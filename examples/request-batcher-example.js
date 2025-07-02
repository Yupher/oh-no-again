const { requestBatcher } = require('../src');

const tasks = [1, 2, 3, 4, 5];

requestBatcher(
  tasks,
  2,
  async (num) => {
    console.log(`Starting task ${num}`);

    // Simulate random failure
    if (Math.random() < 0.3) throw new Error(`Random failure on ${num}`);

    await new Promise((r) => setTimeout(r, 200));

    console.log(`Completed task ${num}`);
    return `✅ ${num}`;
  },
  {
    retries: 3, // Retry failed tasks up to 3 times
    delay: 300, // Wait 300ms (exponential backoff)
    timeout: 800, // Abort if task takes longer than 800ms
  },
)
  .then((res) => console.log('All results:', res))
  .catch((err) => console.error('Batch failed:', err));
