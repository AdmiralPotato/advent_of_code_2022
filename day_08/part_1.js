const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');


const reverseArrays = (array) => array.forEach((a) => a.reverse());

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
  let highest = -Infinity;
  return line.map((tree, treeIndex) => {
    let result = previousPass[treeIndex] || 0
    if (tree > highest) {
      highest = tree;
      result = 1;
    }
    return result
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

const getTotal = (numbers) => numbers.reduce((acc, value) => acc + value, 0);

const processedRows = workGrid(rows);
console.log('processedRows', processedRows);

const transposedProcessedRows = transpose(processedRows);
const processedColumns = workGrid(columns, transposedProcessedRows);
console.log('processedColumns', processedColumns);
const transposedProcessedColumns = transpose(processedColumns);
console.log('transposedProcessedColumns', transposedProcessedColumns);

const rowTotals = transposedProcessedColumns.map(getTotal);
console.log('rowTotals', rowTotals);
const totalTotal = getTotal(rowTotals);
console.log('totalTotal', totalTotal);
