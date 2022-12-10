const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const offset = 20;
const interval = 40;
const isCycleIndexInteresting = (v) => (
  v >= offset &&
  (((v - offset) % interval) === 0)
);

let cycle = 0;
let x = 1;
const cycleSnapshots = [];
const processCycle = () => {
  cycle++;
  if (isCycleIndexInteresting(cycle)) {
    cycleSnapshots.push(cycle * x);
  }
};

lines.forEach((line) => {
  const [
    op,
    value
  ] = line.split(' ');
  if (!value) { // noop
    processCycle();
  } else {
    processCycle();
    processCycle();
    x += parseInt(value, 10);
  }
});

console.log('cycleSnapshots', cycleSnapshots);


const getTotal = (numbers) => numbers.reduce((acc, value) => acc + value, 0);

const total = getTotal(cycleSnapshots);
console.log('total', total);
