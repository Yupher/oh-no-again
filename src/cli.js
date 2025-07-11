const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { requestBatcher } = require('../index');

const args = minimist(process.argv.slice(2), {
  boolean: ['meta', 'fail-fast'],
  alias: {
    c: 'concurrency',
    r: 'retries',
    t: 'timeout',
    d: 'delay',
    f: 'fail-fast',
    m: 'meta',
    i: 'input',
    u: 'url',
  },
  default: {
    concurrency: 3,
    retries: 3,
    timeout: 1000,
    delay: 300,
    'fail-fast': false,
    meta: true,
  },
});

if (!args.input || !args.url) {
  console.error(`Usage:
oha --input data.json --url "https://api.example.com/user/{{id}}" [--concurrency 5 --retries 2 --timeout 500 --delay 200 --meta --fail-fast]`);
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), args.input);
let data;

try {
  data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
} catch (err) {
  console.error('❌ Failed to read or parse input file:', err.message);
  process.exit(1);
}

function buildUrl(template, item) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => item[key.trim()] ?? '');
}

(async () => {
  try {
    const result = await requestBatcher(
      data,
      args.concurrency,
      (item) => ({
        url: buildUrl(args.url, item),
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        retries: args.retries,
        delay: args.delay,
        timeout: args.timeout,
        returnMeta: args.meta,
        failFast: args['fail-fast'],
      },
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
