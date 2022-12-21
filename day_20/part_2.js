const fs = require('node:fs');
const monkeyMap = {}
const weirdBackwardsMap = {}
let stepThatWantsHuman;
const lookup = (parsed, self) => {
  const [
    aPath,
    operator,
    bPath
  ] = parsed
  return (caller) => {
    let a = monkeyMap[aPath].value([caller, self + '-a'].join(' '));
    let b = monkeyMap[bPath].value([caller, self + '-b'].join(' '));
    const result = eval(`a
    ${operator}
    b`);
    const info = {
      self,
      caller,
      aPath,
      bPath,
      a,
      operator,
      b,
      result,
    };
    weirdBackwardsMap[self] = info;
    if (aPath === 'humn') {
      stepThatWantsHuman = info;
    }
    return result;
  }
}
const monkeys = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => {
    const [
      name,
      unsanitizedValue
    ] = line.trim().split(': ');
    const isComplex = unsanitizedValue.includes(' ')
    const parsed = isComplex
      ? unsanitizedValue.split(' ')
      : unsanitizedValue * 1
    const value = isComplex
      ? lookup(parsed, name)
      : () => parsed
    const result = {
      name,
      raw: unsanitizedValue,
      parsed,
      value,
    }
    monkeyMap[name] = result
    return result
  })

// console.log('monkeys', monkeys);
// for (let i = 1e8; i < 1e9; i++) {
//   monkeyMap.humn.value = () => i;
//   const resultValue = monkeyMap[monkeyMap.root.parsed[0]].value();
//   console.log(`i: ${i}, resultValue: ${resultValue}`);
//   if (resultValue === targetValue) {
//     console.log('RESULT FOUND!!!', i)
//     break;
//   }
// }


captureSteps = true;
const badValue = monkeyMap.root.value('root')
console.log('badValue', badValue);

console.log('stepThatWantsHuman', stepThatWantsHuman);
const allSteps = stepThatWantsHuman.caller.split(' ').slice(1);
allSteps.push(stepThatWantsHuman.self + '-a')
console.log('allSteps', allSteps);
const inverseOperationMap = {
  a: {
    '+': (a, b) => b - a,
    '-': (a, b) => b + a,
    '*': (a, b) => b / a,
    '/': (a, b) => b * a,
  },
  b: {
    '+': (a, b) => b - a,
    '-': (a, b) => -(b - a),
    '*': (a, b) => b / a,
    '/': (a, b) => a / b,
  }
}
const oppositeBranchKey = {
  a: 'b',
  b: 'a',
}
const targetValueKey = oppositeBranchKey[allSteps[0].split('-')[1]]
const targetValue = weirdBackwardsMap.root[targetValueKey];
console.log('targetValue', targetValue);
const solveBackwards = (stepKeys) => {
  let remainder
  stepKeys.forEach((oof) => {
    const [
      stepKey,
      branchKey
    ] = oof.split('-')
    const step = weirdBackwardsMap[stepKey]
    const oppositeValue = step[oppositeBranchKey[branchKey]]
    let reverseOperation
    if (remainder === undefined) {
      remainder = oppositeValue;
    } else {
      remainder = inverseOperationMap[branchKey][step.operator](oppositeValue, remainder);
    }
    console.log({
      oof,
      step,
      remainder
    })
  })
  return remainder
};
const result = solveBackwards(allSteps, targetValue)
console.log('result', result);
