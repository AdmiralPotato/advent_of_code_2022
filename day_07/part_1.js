const fs = require('node:fs');
const lines = fs.readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const state = {
  mode: '',
  currentWorkingDirectory: '/',
  fileSystem: {},
};

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

console.log('result', state);
console.log('folders', folders);
const totals = findFolders().map(getFolderTotal);
console.log('totals', totals);
const filteredTotals = totals.filter((value) => value <= 100000);
console.log('filteredTotals', filteredTotals);
const total = filteredTotals.reduce(
  (accumulator, value) => accumulator + value,
  0
);
console.log('total', total);

