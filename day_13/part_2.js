const fs = require('node:fs');
let items = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .replace(/\n\n/gm, '\n')
  .split('\n')
  .map((line) => eval(line));

items = [
  [[2]],
  [[6]],
  ...items
];

const compareAsNumbers = (left, right) => {
  return left === right
    ? 0
    : left < right
      ? -1
      : 1;
}

const compareAsArrays = (left, right) => {
  let result = 0;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    const l = left[i];
    const r = right[i];
    result = compare(l, r);
    if (result !== undefined) {
      break;
    }
  }
  return result;
}

const compare = (left, right) => {
  if (
    typeof left === 'number' &&
    typeof right === 'number'
  ) {
    return compareAsNumbers(left, right);
  } else if (
    typeof left === 'number' &&
    Array.isArray(right)
  ) {
    return compareAsArrays([left], right);
  } else if (
    Array.isArray(left) &&
    typeof right === 'number'
  ) {
    return compareAsArrays(left, [right]);
  } else if (
    Array.isArray(left) &&
    Array.isArray(right)
  ) {
    return compareAsArrays(left, right);
  } else if (
    left === undefined &&
    right !== undefined
  ) {
    return -1;
  } else if (
    left !== undefined &&
    right === undefined
  ) {
    return 1;
  }
}


items.sort(compare);


const keys = [
  '[[2]]',
  '[[6]]',
]
let total = 1;
items.forEach((item, index) => {
  const stringified = JSON.stringify(item);
  if (keys.includes(stringified)) {
    total *= index + 1;
  }
});

console.log('pairs', items);
console.log('total', total);
