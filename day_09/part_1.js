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
let tail = {
  x: 0,
  y: 0,
};

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

const moveTailToHead = () => {
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
  tail = addVectors(move, tail);
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

visitPosition(tail);
instructions.forEach((instruction) => {
  const vector = directionMap[instruction.direction];
  for (let i = 0; i < instruction.length; i++) {
    head = addVectors(head, vector);
    moveTailToHead();
    visitPosition(tail);
  }
});

console.log('visited', Object.keys(visited));
console.log('count', Object.keys(visited).length);
