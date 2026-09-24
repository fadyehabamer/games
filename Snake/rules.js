(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.SnakeRules = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

  function same(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function freeCells(state) {
    const taken = new Set(state.snake.map((p) => p.x + ',' + p.y));
    const cells = [];
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        if (!taken.has(x + ',' + y)) cells.push({ x, y });
      }
    }
    return cells;
  }

  function placeFood(state, rng = Math.random) {
    const cells = freeCells(state);
    if (cells.length === 0) return null;
    return cells[Math.floor(rng() * cells.length)];
  }

  function createState(options = {}) {
    const cols = options.cols || 20;
    const rows = options.rows || 20;
    const rng = options.rng || Math.random;
    const x = Math.floor(cols / 2);
    const y = Math.floor(rows / 2);
    const state = {
      cols,
      rows,
      snake: [{ x, y }, { x: x - 1, y }, { x: x - 2, y }],
      dir: 'right',
      food: null,
      score: 0,
      over: false,
      won: false
    };
    state.food = placeFood(state, rng);
    return state;
  }

  function turn(state, dir) {
    if (!DIRS[dir] || dir === OPPOSITE[state.dir]) return state;
    return { ...state, dir };
  }

  function step(state, rng = Math.random) {
    if (state.over) return state;
    const dir = state.dir;
    const head = state.snake[0];
    const next = { x: head.x + DIRS[dir].x, y: head.y + DIRS[dir].y };
    const eating = state.food !== null && same(next, state.food);
    const body = eating ? state.snake : state.snake.slice(0, -1);
    const hitWall = next.x < 0 || next.y < 0 || next.x >= state.cols || next.y >= state.rows;
    if (hitWall || body.some((p) => same(p, next))) {
      return { ...state, dir, over: true };
    }
    const moved = { ...state, dir, snake: [next, ...body] };
    if (eating) {
      moved.score = state.score + 1;
      moved.food = placeFood(moved, rng);
      if (moved.food === null) {
        moved.won = true;
        moved.over = true;
      }
    }
    return moved;
  }

  return { DIRS, OPPOSITE, createState, placeFood, freeCells, turn, step };
});
