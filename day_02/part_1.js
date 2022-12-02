const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf-8');

const lines = input
  .trim()
  .split('\n');
const selfScoreMap = {
  X: 1,
  Y: 2,
  Z: 3
};
const elfLabelMap = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors'
};
const selfLabelMap = {
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors'
};
const situationMap = {
  'A Y': 6,
  'B Z': 6,
  'C X': 6,
  'A Z': 0,
  'B X': 0,
  'C Y': 0,
  'A X': 3,
  'B Y': 3,
  'C Z': 3
};
const playRound = (line) => {
  const [ elf, self ] = line
    .trim()
    .split(' ');
  const moveScore = selfScoreMap[self];
  const stateScore = situationMap[line];
  return moveScore + stateScore;
};

const totalScore = lines
  .map(playRound)
  .reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue;
    },
    0
  );

console.log('totalScore:', totalScore);
