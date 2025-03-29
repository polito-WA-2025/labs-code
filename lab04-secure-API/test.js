'use strict';
const dayjs = require("dayjs");

const d = dayjs("");
console.log(`dayjs with empty string: '${d}'`);
const d2 = dayjs(undefined);
console.log(`dayjs with undefined: '${d2}'`);
const d3 = dayjs(null);
console.log(`dayjs with null: '${d3}'`);

const s = "a";
let v;
if (s) v=1; else v=0;
console.log(v);

//const errors = ["a", "b"];
const errors = ["a"];
console.log(errors.join(", "));

const req = { body: {id: 3}, params: {id: '3'} };
console.log(req.body?.id);
console.log(Number(req.params.id));
if (req.body?.id !== Number(req.params.id))
    console.log('mismatch');
else
    console.log('no mismatch');
