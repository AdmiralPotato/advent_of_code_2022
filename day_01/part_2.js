const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf-8').trim();

const parseLine = (line) => parseInt(line, 10);
const elfs = input.split('\n\n').map((lines) => lines
  .split('\n')
  .map(parseLine)
);
const scores = [];
const getTotal = (numbers) => numbers.reduce((acc, value) => acc + value, 0);
elfs.forEach((numbers) => {
  const total = getTotal(numbers);
  scores.push(total);
});

// console.log('scores', scores.join('\n'));

scores.sort((a, b) => a - b);
// console.log('scores sorted', scores.join('\n'));
console.log('total', getTotal(scores.slice(-3)));
