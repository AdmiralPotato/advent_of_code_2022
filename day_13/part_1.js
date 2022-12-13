const fs = require('node:fs');
const pairs = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n')
  .map((lines) => lines.split('\n').map((line) => eval(line)))


const compareAsNumbers = (left, right) => {
  return left === right
    ? undefined
    : left < right;
}

const compareAsArrays = (left, right) => {
  let result;
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
    return true;
  } else if (
    left !== undefined &&
    right === undefined
  ) {
    return false;
  }
}

let total = 0;
pairs.forEach(([left, right], index) => {
  if (compare(left, right)) {
    total += index + 1;
  }
})

console.log('pairs', pairs);
console.log('total', total);
