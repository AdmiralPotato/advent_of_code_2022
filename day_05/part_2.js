const fs = require('node:fs');
const [
  towerString,
  moveString,
] = fs.readFileSync('input.txt', 'utf-8')
  .split('\n\n');
const towerRegex = /(.{3})( ?)/g;
const stripBracketsRegex = /\[|\]/g;
let columns = [];
towerString
  .split('\n')
  .slice(0, -1)
  .forEach((line) => {
    let column = 0;
    let match = towerRegex.exec(line)
    do {
      if (!columns[column]) {
        columns[column] = []
      }
      const letter = match[1].replace(stripBracketsRegex, '').trim()
      if (letter) {
        columns[column].push(letter)
      }
      column += 1;
    } while (match = towerRegex.exec(line))
  });
columns.map((column) => {
  column.reverse();
})

const moveRegex = /move (.*) from (.*) to (.*)/
const moves = moveString
  .trim()
  .split('\n')
  .map((line) => {
    let column = 0;
    let match = moveRegex.exec(line)
    if (!columns[column]) {
      columns[column] = []
    }
    const [
      count,
      from,
      to,
    ] = match
      .slice(1)
      .map((stringNumber) => parseInt(stringNumber, 10));
    return {
      count,
      from,
      to,
    }
  });


console.log('columns', columns);
console.log('moves', moves);

const moveTheThings = (move) => {
  const fromColumn = columns[move.from - 1];
  const removed = fromColumn.slice(-move.count);
  // removed.reverse();
  columns[move.from - 1] = fromColumn.slice(0, -move.count);
  removed.forEach((item) => {
    columns[move.to - 1].push(item)
  })
}

moves.forEach(moveTheThings)

console.log('columns After Moves', columns);

const result = columns
  .map((column) => column.pop())
  .join('')

console.log('top Containers', result);
