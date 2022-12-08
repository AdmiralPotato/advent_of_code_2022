const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const rows = lines.map((line) => line.split(''));

const transpose = (rows) => {
  const rowLength = rows[0].length;
  const columns = [];
  for (let i = 0; i <rowLength; i++) {
    const column = [];
    columns.push(column);
    for (let j = 0; j < rows.length; j++) {
      column[j] = rows[j][i];
    }
  }
  return columns;
}

const columns = transpose(rows);

console.log('columns', columns);
console.log('rows', rows);

const mapVisibleTrees = (line, previousPass = []) => {
  return line.map((tree, treeIndex, trees) => {
    let result = 0
    for (let i = treeIndex + 1; i < trees.length; i++) {
      const visibleTree = trees[i];
      if (visibleTree < tree) {
        result += 1;
      } else {
        result += 1;
        break;
      }
    }
    return result * (previousPass[treeIndex] || 1)
  })
};

const workGrid = (grid, previousGrid = []) => {
  return grid.map((line, lineIndex) => {
    const previousLine = previousGrid[lineIndex]
    const forward = mapVisibleTrees(line, previousLine)
    line.reverse()
    forward.reverse()
    const backward = mapVisibleTrees(line, forward)
    line.reverse()
    backward.reverse()
    return backward
  })
}

const getMax = (numbers) => Math.max(...numbers);

const processedRows = workGrid(rows);
console.log('processedRows', processedRows);

const transposedProcessedRows = transpose(processedRows);
const processedColumns = workGrid(columns, transposedProcessedRows);
console.log('processedColumns', processedColumns);
const transposedProcessedColumns = transpose(processedColumns);
console.log('transposedProcessedColumns', transposedProcessedColumns);

const rowMaxes = transposedProcessedColumns.map(getMax);
console.log('rowMaxes', rowMaxes);
const maxMax = getMax(rowMaxes);
console.log('maxMax', maxMax);
