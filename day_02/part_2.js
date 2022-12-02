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
const expectedOutcomeMap = {
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors'
};
const outcomeMap = {
  'A X': 0,
  'A Y': 3,
  'A Z': 6,
  'B X': 0,
  'B Y': 3,
  'B Z': 6,
  'C X': 0,
  'C Y': 3,
  'C Z': 6
};
const playMap = {
  'A X': 3,
  'A Y': 1,
  'A Z': 2,
  'B X': 1,
  'B Y': 2,
  'B Z': 3,
  'C X': 2,
  'C Y': 3,
  'C Z': 1
};
const playRound = (line) => {
  const moveScore = playMap[line];
  const stateScore = outcomeMap[line];
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
