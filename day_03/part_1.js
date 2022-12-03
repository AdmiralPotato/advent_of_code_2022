const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const mapChars = (string) => {
  const result = {};
  string
    .split('')
    .forEach((char) => {
      result[char] = (result[char] || 0) + 1
    })
  return result;
}

const intersectMaps = (a, b) => {
  const result = [];
  Object.keys(a)
    .forEach((char) => {
      if (b[char]) {
        result.push(char)
      }
    });
  return result;
}


function isUpperCase(myString) {
  return myString === myString.toUpperCase();
}

const getTotal = (numbers) => numbers.reduce((acc, value) => acc + value, 0);

const dunno = lines.map((line) => {
  const length = line.length / 2;
  const a = line.slice(0, length);
  const b = line.slice(-length);
  const mapA = mapChars(a);
  const mapB = mapChars(b);
  const intersection = intersectMaps(mapA, mapB)[0];
  let value = parseInt(intersection, 36) - 9;
  if (isUpperCase(intersection)) {
    value += 26;
  }
  return value;
});

console.log('dunno', dunno);
console.log('total', getTotal(dunno));
