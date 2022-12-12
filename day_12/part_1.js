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
      visited: [],
      path: [],
      sparseData: [],
      currentPosition: 0,
      message: '',
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
      this.indexOfStart = indexOfStart;
      this.indexOfEnd = indexOfEnd;
      this.path.push(this.indexOfStart);
      this.visited.push(this.indexOfStart);
      this.currentPosition = this.indexOfStart;

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
      return {
        style: {
          color: '#333',
          backgroundColor: `rgb(${v} ${v} ${v})`,
        },
        class: {
          ['x-' + x]: true,
          ['y-' + y]: true,
          start: index === this.indexOfStart,
          end: index === this.indexOfEnd,
          visited: this.visited.includes(index),
          path: this.path.includes(index),
          current: index === this.currentPosition,
        },
        innerText: value
      };
    },
    getValidNeighbors (index) {
      const current = this.getPosAtIndex(index);
      const neighbors = Object.keys(directionMap)
        .map((direction) => {
          return this.getDirection(current, direction)
        })
        .filter((v) => (v?.value <= current.value + 1))
        .filter((v) => !this.path.includes(v?.index))
        .filter((v) => !this.visited.includes(v?.index));
      neighbors.sort((a, b) => b.value - a.value);
      return neighbors;
    },
    step () {
      const neighbors = this.getValidNeighbors(this.currentPosition);
      if(neighbors.length) {
        const next = neighbors[0].index;
        this.path.push(next);
        this.currentPosition = next;
        if (next === this.indexOfEnd) {
          this.message = `END LOCATED!!! ${neighbors[0].index}`;
          this.message += ` Steps: ${this.path.length - 1}`;
          this.stop();
        }
      } else {
        // must be a dead end. Go back.
        const badPath = this.path.pop();
        this.visited.push(badPath);
        this.currentPosition = this.path.slice(-1)[0];
      }
    },
    animate () {
      this.stop();
      this.interval = setInterval(
        () => {
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
          this.step();
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
