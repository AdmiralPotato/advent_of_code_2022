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

const intersectArrays = (a, b) => {
  const result = [];
  a.forEach((char) => {
    if (b.includes(char)) {
      result.push(char)
    }
  });
  return result;
}


function isUpperCase(myString) {
  return myString === myString.toUpperCase();
}

let total = 0;
for (let i = 0; i < lines.length; i += 3) {
  const mapA = mapChars(lines[i]);
  const mapB = mapChars(lines[i + 1]);
  const mapC = mapChars(lines[i + 2]);
  const intersectAB = intersectMaps(mapA, mapB);
  // const intersectBC = intersectMaps(mapB, mapC);
  const intersectCA = intersectMaps(mapC, mapA);

  const intersection = intersectArrays(
    intersectAB,
    intersectCA,
  )[0];
  let value = parseInt(intersection, 36) - 9;
  if (isUpperCase(intersection)) {
    value += 26;
  }
  total += value;
}

console.log('total', total);
