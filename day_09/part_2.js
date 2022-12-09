const fs = require('node:fs');
const instructions = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => {
    const [
      direction,
      length
    ] = line.split(' ');
    return {
      direction,
      length: parseInt(length, 10)
    }
  });


let head = {
  x: 0,
  y: 0,
};

let tails = [
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
  {x: 0, y: 0},
];

const visited = {};

const addVectors = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}
const subVectors = (a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

const visitPosition = (a) => {
  const key = JSON.stringify(a);
  visited[key] = (visited[key] || 0) + 1;
}

const moveTailAtIndexByLead = (head, tailIndex) => {
  const tail = tails[tailIndex];
  const diff = subVectors(head, tail);
  const move = {x: 0, y: 0};
  if (
    (
      Math.abs(diff.x) > 1 &&
      diff.y
    ) ||
    (
      Math.abs(diff.y) > 1 &&
      diff.y
    )
  ) {
    move.x = Math.sign(diff.x);
    move.y = Math.sign(diff.y);
  } else {
    if (Math.abs(diff.x) > 1) {
      move.x = Math.sign(diff.x);
    }
    if (Math.abs(diff.y) > 1) {
      move.y = Math.sign(diff.y);
    }
  }
  tails[tailIndex] = addVectors(move, tail);
  // console.log('----');
  // console.log('head: ' + JSON.stringify(head));
  // console.log('diff: ' + JSON.stringify(diff));
  // console.log('move: ' + JSON.stringify(move));
  // console.log('tail: ' + JSON.stringify(tail));
}

const directionMap = {
  U: {x: 0, y: 1},
  D: {x: 0, y: -1},
  R: {x: 1, y: 0},
  L: {x: -1, y: 0},
};

visitPosition(tails[8]);
instructions.forEach((
  instruction,
  instructionIndex
) => {
  const vector = directionMap[instruction.direction];
  for (let i = 0; i < instruction.length; i++) {
    head = addVectors(head, vector);
    let lead = head;
    for (let j = 0; j < tails.length; j++) {
      moveTailAtIndexByLead(lead, j);
      lead = tails[j];
    }
    // tails.forEach((tail, tailIndex) => {
    //   moveTailAtIndexByLead(lead, tailIndex);
    //   lead = tail;
    // })
    visitPosition(tails[8]);
  }
});

console.log('visited', );
console.log('tails', JSON.stringify(tails));

var output = `
var visited = ${'[\n\t' + Object.keys(visited).join(',\n\t') + '\n]'};
var tails = ${'[\n\t' + Object.keys(visited).join(',\n\t') + '\n]'};
`;
fs.writeFileSync('data.js', output);

console.log('count', Object.keys(visited).length);
