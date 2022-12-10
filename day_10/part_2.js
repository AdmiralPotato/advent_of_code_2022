const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');


const interval = 40;
const wrapSignal = (v) => ((v % interval) === 0);

let cycle = 0;
let x = 1;
let output = '';
const processCycle = () => {
  if (wrapSignal(cycle)) {
    output += '\n';
  }
  const cycleMod = cycle % interval;
  output += (
    cycleMod === x ||
    cycleMod === (x + 1) ||
    cycleMod === (x - 1)
  )
    ? '#'
    : ' '
  cycle++;
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

console.log('output', output);
