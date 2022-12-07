const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const state = {
  mode: '',
  currentWorkingDirectory: '/',
  fileSystem: {},
};

const diskSize = 70000000;
const requiredSpace = 30000000;

const commandMap = {
  cd: (path) => {
    console.log('cd to', path);
    if (path === '/') {
      state.currentWorkingDirectory = '/'
    } else if (
      path === '..' &&
      state.currentWorkingDirectory === '/'
    ) {
      console.log('You are already at the top! Cannot go higher!')
    } else if (path === '..') {
      const pathSplit = state.currentWorkingDirectory
        .split('/')
        .filter((item) => !!item);
      pathSplit.pop();
      state.currentWorkingDirectory = '/';
      if (pathSplit.length) {
        state.currentWorkingDirectory += pathSplit.join('/') + '/'
      }
    } else {
      state.currentWorkingDirectory += path + '/'
    }
  },
  ls: () => {
    console.log('LET ME SHOW YOU SOME FILES')
    state.mode = 'ls'
  },
};

const processLine = (line) => {
  const split = line.split(' ');
  if (split[0] === '$') {
    // it's a command
    const commandName = split[1];
    const command = commandMap[commandName];
    if (command) {
      command(split[2])
    } else {
      throw new Error('Invalid command: ' + commandName);
    }
  } else {
    if (state.mode === 'ls') {
      if (split[0] === 'dir') {
        const fileName = split[1];
        const fullPath = (
          state.currentWorkingDirectory +
          fileName
        )
        console.log('found directory', fullPath)
        state.fileSystem[fullPath] = 0;
      } else {
        const fileSize = parseInt(split[0], 10);
        const fileName = split[1];
        const fullPath = (
          state.currentWorkingDirectory +
          fileName
        )
        console.log(fullPath, fileSize)
        state.fileSystem[fullPath] = fileSize;
      }
    }
  }
};

lines.forEach(processLine);

const findFolders = () => {
  return Object.entries(state.fileSystem)
    .filter(([key, value]) => value === 0)
    .map(([key]) => key)
}

const folders = findFolders();

const getFolderTotal = (path) => {
  return Object.entries(state.fileSystem)
    .filter(([key, value]) => key.startsWith(path))
    .map(([key, value]) => value)
    .reduce(
      (accumulator, value) => accumulator + value,
      0
    )
};

const diskSpaceUsed = getFolderTotal('/');
const availableSpace = diskSize - diskSpaceUsed;
const minimumDeleteSize = requiredSpace - availableSpace;

console.log('diskSpaceUsed', diskSpaceUsed);
console.log('availableSpace', availableSpace);
console.log('minimumDeleteSize', minimumDeleteSize);

console.log('result', state);
// console.log('folders', folders);
const totals = findFolders().map(getFolderTotal);
// console.log('totals', totals);
const filteredTotals = totals.filter((value) => value >= minimumDeleteSize);
console.log('filteredTotals', filteredTotals);
filteredTotals.sort((a, b) => a - b);
console.log('sorted filteredTotals', filteredTotals);
const result = filteredTotals[0];
console.log('result', result);

