const { createBatches } = require('../src');

const users = Array.from({ length: 11 }, (_, i) => `User${i + 1}`);
const batched = createBatches(users, 3);

console.log(batched);
/*
[
  [ 'User1', 'User2', 'User3' ],
  [ 'User4', 'User5', 'User6' ],
  [ 'User7', 'User8', 'User9' ],
  [ 'User10', 'User11' ]
]
*/
