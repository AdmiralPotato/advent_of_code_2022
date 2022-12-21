const fs = require('node:fs');
const monkeyMap = {}
const lookup = (text) => {
  const [
    a,
    operator,
    b
  ] = text.split(' ')
  return () => {
    let valueA = monkeyMap[a].value()
    let valueB = monkeyMap[b].value()
    const result = eval(`valueA ${operator} valueB`);
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
    const value = unsanitizedValue.includes(' ')
      ? lookup(unsanitizedValue)
      : () => unsanitizedValue * 1
    const result = {
      name,
      raw: unsanitizedValue,
      value,
    }
    monkeyMap[name] = result
    return result
  })

console.log('monkeys', monkeys);
const result = monkeyMap.root.value();
console.log('result', result);
