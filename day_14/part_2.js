const dataPath = './input.txt';
const { createApp } = window.Vue

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

const mapRange = (a, b, x, y, valueAB) => {
  const diff0 = a - b
  const diff1 = x - y
  const valueDiff = (valueAB - b) / diff0
  return y + (valueDiff * diff1)
}
const bound = (min, max, value) => {
  return Math.min(max, Math.max(min, value))
}
const lerp = (a, b, progress) => {
  return a + ((b - a) * progress)
}
const getDistance = (a, b) => {
  const diffX = a.x - b.x
  const diffY = a.y - b.y
  return getLength(diffX, diffY)
}
const getLength = (x, y) => { return Math.sqrt((x * x) + (y * y)) }

const lerpVert = (a, b, progress) => {
  return {
    x: lerp(a.x, b.x, progress),
    y: lerp(a.y, b.y, progress),
  }
}

const directionMap = {
  down: {x: 0, y: 1},
  downLeft: {x: -1, y: 1},
  downRight: {x: 1, y: 1},
};

window.app = createApp({
  data() {
    return {
      text: '',
      columns: 0,
      rows: 0,
      lines: [],
      offset: {},
      bounds: {},
      fallPath: [],
      sparseDataMap: [],
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
    checkBounds (pos) {
      return (
        pos.x >= this.bounds.xMin &&
        pos.x <= this.bounds.xMax &&
        pos.y >= this.bounds.yMin &&
        pos.y <= this.bounds.yMax
      )
    },
    calculateBounds () {
      const bounds = {
        xMin: Infinity,
        xMax: -Infinity,
        yMin: -2,
        yMax: -Infinity,
      };
      Object.entries(this.sparseDataMap).forEach(([key, value]) => {
        bounds.yMax = Math.max(value.y, bounds.yMax);
      });
      const xOffset = 500;
      bounds.yMax += 1;
      bounds.xMax = xOffset + bounds.yMax + 3;
      bounds.xMin = xOffset - bounds.yMax - 2;
      this.bounds = bounds;
      this.offset = {
        x: bounds.xMin,
        y: bounds.yMin,
      };
      this.columns = bounds.xMax - bounds.xMin;
      this.rows = bounds.yMax - bounds.yMin + 2;
    },
    offsetPosition (x, y) {
      return Object.values(addVectors({
        x,
        y,
      }, this.offset)).join();
    },
    getValueAtPos (pos) {
      const key = [
        pos.x,
        pos.y,
      ].join();
      return this.sparseDataMap[key];
    },
    getValueAtGridPos (x, y) {
      const key = this.offsetPosition(x, y);
      return this.sparseDataMap[key];
    },
    getValueAtIndex (index) {
      return this.data[index];
    },
    handleSubmit () {
      this.init(this.text)
    },
    drawLine (line) {
      line.slice(1).forEach((b, index) => {
        const a = line[index]; // in the previous array, index is a behind
        const length = getDistance(a, b);
        a.type = 'rock';
        this.putCell(a);
        b.type = 'rock';
        this.putCell(b);
        for (let i = 0; i < length; i++) {
          const cell = lerpVert(a, b, i / length);
          cell.type = 'rock';
          this.putCell(cell);
        }
      })
    },
    init (input) {
      this.text = input.trim()
      this.lines = this.text.trim().split('\n')
        .map((line) => line.split(' -> ')
          .map((pos) => {
            const [x, y] = pos.split(',');
            return {
              x: x * 1,
              y: y * 1,
            };
          })
        );

      this.sparseDataMap = {};
      // this.putCell({
      //   type: 'source',
      //   x: 500,
      //   y: 0,
      // });
      this.fallPath.push(
        {
          x: 500,
          y: 0,
          type: 'falling'
        },
        {
          x: 500,
          y: 0,
          type: 'falling'
        }
      );

      this.lines.forEach(this.drawLine);

      this.calculateBounds();

      console.log('lines.length', this.lines.length);
    },
    cellBind (x, y) {
      const cell = this.getValueAtGridPos(x, y) || {};
      return {
        class: {
          ['x-' + x]: true,
          ['y-' + y]: true,
          [cell.type || 'empty']: true,
        }
      };
    },
    getDirection (pos, direction) {
      const newPos = addVectors(
        pos,
        directionMap[direction]
      )
      const inBounds = this.checkBounds(newPos);
      if (!inBounds) {
        newPos.type = 'oob'
      }
      const valueAtCell = this.getValueAtPos(newPos)
      return valueAtCell || newPos;
    },
    getValidNeighbor (cell) {
      return Object.keys(directionMap)
        .map((direction) => {
          return this.getDirection(cell, direction)
        })
        .filter((n) => n) // present at all, eg, in bounds
        .find((n) => !n.type); // must not be populated
    },
    putCell (cell) {
      const key = [
        cell.x,
        cell.y,
      ].join();
      this.sparseDataMap[key] = cell;
    },
    advanceSand (cell) {
      const neighbor = this.getValidNeighbor(cell);
      if (!neighbor) {
        cell.type = 'settled';
      } else {
        const previousKey = [
          cell.x,
          cell.y,
        ].join();
        delete this.sparseDataMap[previousKey];
        if (neighbor.type === 'oob') {
          return neighbor;
        } else {
          this.fallPath.push(
            JSON.parse(JSON.stringify(cell))
          );
          cell.x = neighbor.x;
          cell.y = neighbor.y;
          const nextKey = [
            cell.x,
            cell.y,
          ].join();
          this.sparseDataMap[nextKey] = cell;
        }
      }
      return cell;
    },
    step () {
      this.currentIteration += 1;
      let fallingSands = Object.values(this.sparseDataMap)
        .filter((cell) => cell.type === 'falling')
      if (!fallingSands.length) {
        const newFallingSand = this.fallPath.pop();
        if (newFallingSand) {
          this.putCell(newFallingSand);
          fallingSands.push(newFallingSand);
        }
      }
      fallingSands.forEach(this.advanceSand)
      const sourceBlockPosition = this.getValueAtPos({
        x: 500,
        y: 0
      });
      if (sourceBlockPosition) {
        const settledSand = Object.values(this.sparseDataMap)
          .filter((cell) => cell.type === 'settled')
        this.message = `Settled sand count: ${settledSand.length}`
        this.stop();
      }
    },
    animate () {
      this.stop();
      this.interval = setInterval(
        () => {
          for (let i = 0; i < 100; i++) {
            this.step();
          }
        },
        0
      );
    },
    stop () {
      clearTimeout(this.interval);
    },
  },
}).mount('#app')
