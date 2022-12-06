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

const detectStart = (string) => {
  return Object.keys(mapChars(string)).length === 4;
}

const findStart = (line) => {
  const chars = line.split('')
  for (let i = 4; i < chars.length; i++) {
    const chunk = chars.slice(i - 4, i).join('')
    if (detectStart(chunk)) {
      return i;
    }
  }
}

const result = lines.map(findStart);

console.log('result', result);
