const dataPath = './input.txt';
const { createApp } = window.Vue

const addVectors = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}
const directionMap = {
  up: {x: 0, y: -1},
  down: {x: 0, y: 1},
  right: {x: 1, y: 0},
  left: {x: -1, y: 0},
};

window.app = createApp({
  data() {
    return {
      columns: 0,
      rows: 0,
      data: [],
      goats: [],
      sparseData: [],
      message: '',
      currentIteration: 0,
    }
  },
  created () {
    fetch(dataPath)
      .then((response) => response.text())
      .then(this.init)
  },
  methods: {
    getIndexAtPos (x, y) {
      return (y * this.columns) + x
    },
    getPosAtIndex (index) {
      return {
        x: index % this.columns,
        y: Math.floor(index / this.columns),
        index,
        value: this.getValueAtIndex(index)
      }
    },
    getDirection (pos, direction) {
      const newPos = addVectors(
        pos,
        directionMap[direction]
      )
      const inBounds = this.checkBounds(newPos)
      return inBounds
        ? this.getPosAtIndex(this.getIndexAtPos(
          newPos.x,
          newPos.y,
        ))
        : undefined
    },
    checkBounds (pos) {
      return (
        pos.x >= 0 &&
        pos.x < this.columns &&
        pos.y >= 0 &&
        pos.y < this.rows
      )
    },
    getValueAtPos (x, y) {
      return this.getValueAtIndex(this.getIndexAtPos(x, y));
    },
    getValueAtIndex (index) {
      return this.data[index];
    },
    init (input) {
      const text = input.trim()
      const columns = text.indexOf('\n')
      let data = text
        .replace(/\n/g, '')
        .split('');

      const indexOfStart = data.indexOf('S');
      const indexOfEnd = data.indexOf('E');
      data[indexOfStart] = 'a';
      data[indexOfEnd] = 'z';

      data = data.map((letter) => parseInt(letter, 36) - 10)

      const rows = Math.floor(data.length / columns);

      this.columns = columns;
      this.rows = rows;
      this.data = data;
      this.indexOfStart = indexOfEnd;
      this.indexOfEnd = indexOfStart;
      this.goats.push(this.indexOfStart);
      this.sparseData[this.indexOfStart] = 0;

      console.log('columns', columns);
      console.log('rows', rows);
      console.log('indexOfStart', indexOfStart);
      console.log('indexOfEnd', indexOfEnd);
      console.log('data.length', data.length);
      console.log('getValueAtPos(1, 1)', this.getValueAtPos(0, 0));
      console.log('getValueAtPos(1, 1)', this.getValueAtPos(1, 1));
      console.log('getValueAtPos(7, 4)', this.getValueAtPos(7, 4));
      console.log('data', data);
    },
    cellBind (x, y) {
      const index = this.getIndexAtPos(x, y)
      const value = this.data[index];
      const v = Math.floor((value / 36) * 255);
      const score = this.sparseData[index];
      return {
        style: {
          color: score ? `hsl(${score % 360} 100% 50%)` : '#333',
          backgroundColor: `rgb(${v} ${v} ${v})`,
        },
        class: {
          ['x-' + x]: true,
          ['y-' + y]: true,
          start: index === this.indexOfStart,
          end: index === this.indexOfEnd,
          score,
          current: this.goats.includes(index),
        },
        innerText: score || value
      };
    },
    getValidNeighbors (index) {
      const current = this.getPosAtIndex(index);
      const neighbors = Object.keys(directionMap)
        .map((direction) => {
          return this.getDirection(current, direction)
        })
        .filter((v) => (v?.value >= current.value - 1))
        .filter((v) => this.sparseData[v?.index] === undefined);
      neighbors.sort((a, b) => b.value - a.value);
      return neighbors;
    },
    step () {
      this.currentIteration += 1;
      const allNeighbors = this.goats.map(this.getValidNeighbors);
      this.goats = [];
      const neighbors = allNeighbors.reduce(
        (acc, v) => acc.concat(v),
        []
      )
      neighbors.forEach((neighbor) => {
        const next = neighbor.index;
        if (!this.goats.includes(next)) {
          this.goats.push(next);
        }
        this.sparseData[next] = this.sparseData[next] || this.currentIteration;
        if (neighbor.value === 0) {
          this.message = `END LOCATED!!! ${neighbors[0].index}`;
          this.message += ` Steps: ${this.currentIteration}`;
          this.stop();
        }
      })
    },
    animate () {
      this.stop();
      this.interval = setInterval(
        () => {
          this.step();
        },
        0
      );
    },
    stop () {
      clearTimeout(this.interval);
    },
  },
}).mount('#app')
