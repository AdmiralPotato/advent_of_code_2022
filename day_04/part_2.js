const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const results = lines.map((line) => {
  const [
    l1,
    r1,
    l2,
    r2
  ] = line
    .trim()
    .replace(',', '-')
    .split('-')
    .map((string) => parseInt(string, 10));

  if (
    l2 <= l1 && r2 >= r1
  ) {
    console.log(line + ' set one completely contained')
    return 1 // line + ' set one completely contained'
  } else if (
    l1 <= l2 && r1 >= r2
  ) {
    console.log(line + ' set two completely contained')
    return 1 // line + ' set two completely contained'
  } else if (
    (l1 >= l2 && l1 <= r2) ||
    (r1 >= l2 && r1 <= r2)
  ) {
    console.log(line + ' overlap')
    return 1 // line + ' set two completely contained'
  } else {
    return 0 //line + ' nope'
  }
})
  .filter((i) => i)

console.log('results', results.length);
