"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("./index.js");
(0, index_js_1.retryHelper)(function (signal) {
    return fetch('https://jsonplaceholder.typicode.com/users/1', { signal: signal });
}).then();
(0, index_js_1.requestBatcher)([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], 2, function (_a) {
    var id = _a.id;
    return ({
        url: "https://jsonplaceholder.typicode.com/users/".concat(id),
    });
}, {
    retries: 2,
    timeout: 300,
    hooks: {
        onBatchStart: function (i, batch) { return console.log(i, batch); },
    },
}).then(console.log);
