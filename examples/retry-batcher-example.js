const { requestBatcher } = require('../src');

const tasks = [1, 2, 3, 4, 5];

requestBatcher(
  tasks,
  2,
  async (num) => {
    console.log(`Starting task ${num}`);
    if (Math.random() < 0.3) throw new Error(`Random failure ${num}`);
    await new Promise((r) => setTimeout(r, 200));
    console.log(`Completed task ${num}`);
    return `✅ ${num}`;
  },
  {
    retries: 3,
    delay: 200,
    timeout: 800,
  },
)
  .then((res) => console.log('All results:', res))
  .catch((err) => console.error('Batch failed:', err));
