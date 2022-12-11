const fs = require('node:fs');
const monkeyStrings = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n')

const parseMonkeyIndex = (value) => {
  return parseInt(value.replace('throw to monkey ', ''), 10)
}

const processes = {
  'Starting items': (value) => value.split(', ').map((n) => parseInt(n, 10)),
  Operation: (value) => {
    const operation = value
      .replace('new = ', '')
    return eval(`(old) => (${operation})`)
  },
  Test: (value, monkey) => {
    monkey.divisor = parseInt(value.replace('divisible by ', ''), 10)
    return (n) => (n % monkey.divisor === 0)
  },
  'If true': parseMonkeyIndex,
  'If false': parseMonkeyIndex,
}
const monkeys = monkeyStrings.map((monkeyString) => {
  const monkey = {
    itemsInspected: 0
  };
  monkeyString
    .trim()
    .split('\n')
    .forEach((monkeyLine) => {
      const [
        property,
        value
      ] = monkeyLine.trim().split(':')
      if (!value) {
        monkey.name = property;
      } else {
        const propertyTrimed = property.trim()
        const process = processes[propertyTrimed]
        monkey[propertyTrimed] = process(value.trim(), monkey);
      }
    });
  return monkey;
});

const multiplyAll = (numbers) => numbers.reduce((acc, value) => acc * value, 1);
const divisors = monkeys.map((m) => m.divisor)
const worryLevelDivisor = multiplyAll(divisors)

console.log('worryLevelDivisor', worryLevelDivisor);

const processMonkeyTurn = (monkey, monkeyIndex) => {
  const items = monkey['Starting items']
  const processedItems = items.map((value) => {
    const operationOutput = monkey.Operation(value) % worryLevelDivisor;
    return operationOutput;
  });
  monkey['Starting items'] = []
  processedItems.forEach((value) => {
    const destinationMonkeyIndex = monkey.Test(value)
      ? monkey[ 'If true']
      : monkey[ 'If false']
    const targetMonkey = monkeys[destinationMonkeyIndex];
    targetMonkey['Starting items'].push(value);
    monkey.itemsInspected += 1;
  })
}

console.log('monkeys start', monkeys);

const turns = 10000;
for (let i = 0; i < turns; i++) {
  monkeys.forEach(processMonkeyTurn);
}
console.log('monkeys after 20 turns', monkeys);

const monkeyScores = monkeys.map((m) => m.itemsInspected);
monkeyScores.sort((a, b) => b - a);
console.log('monkeyScores', monkeyScores);

// 32348900163 is too high
console.log('monkey business', monkeyScores[0] * monkeyScores[1]);
