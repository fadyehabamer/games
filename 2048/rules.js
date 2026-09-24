(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.Rules2048 = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const SIZE = 4;

  function createGrid(size = SIZE) {
    return Array.from({ length: size }, () => Array(size).fill(0));
  }

  function cloneGrid(grid) {
    return grid.map((row) => row.slice());
  }

  function slideRow(row) {
    const values = row.filter((v) => v !== 0);
    const out = [];
    let gained = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const merged = values[i] * 2;
        out.push(merged);
        gained += merged;
        i++;
      } else {
        out.push(values[i]);
      }
    }
    while (out.length < row.length) out.push(0);
    return { row: out, gained };
  }

  function transpose(grid) {
    return grid[0].map((_, c) => grid.map((row) => row[c]));
  }

  function reverseRows(grid) {
    return grid.map((row) => row.slice().reverse());
  }

  function toRows(grid, direction) {
    if (direction === 'left') return cloneGrid(grid);
    if (direction === 'right') return reverseRows(grid);
    if (direction === 'up') return transpose(grid);
    if (direction === 'down') return reverseRows(transpose(grid));
    throw new Error('Unknown direction: ' + direction);
  }

  function fromRows(rows, direction) {
    if (direction === 'left') return rows;
    if (direction === 'right') return reverseRows(rows);
    if (direction === 'up') return transpose(rows);
    return transpose(reverseRows(rows));
  }

  function move(grid, direction) {
    let gained = 0;
    const slid = toRows(grid, direction).map((row) => {
      const result = slideRow(row);
      gained += result.gained;
      return result.row;
    });
    const next = fromRows(slid, direction);
    const moved = next.some((row, r) => row.some((v, c) => v !== grid[r][c]));
    return { grid: next, gained, moved };
  }

  function emptyCells(grid) {
    const cells = [];
    grid.forEach((row, r) => row.forEach((v, c) => {
      if (v === 0) cells.push([r, c]);
    }));
    return cells;
  }

  function addRandomTile(grid, rng = Math.random) {
    const cells = emptyCells(grid);
    if (cells.length === 0) return grid;
    const [r, c] = cells[Math.floor(rng() * cells.length)];
    const next = cloneGrid(grid);
    next[r][c] = rng() < 0.9 ? 2 : 4;
    return next;
  }

  function canMove(grid) {
    if (emptyCells(grid).length > 0) return true;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const v = grid[r][c];
        if (c + 1 < grid[r].length && grid[r][c + 1] === v) return true;
        if (r + 1 < grid.length && grid[r + 1][c] === v) return true;
      }
    }
    return false;
  }

  function hasWon(grid, target = 2048) {
    return grid.some((row) => row.some((v) => v >= target));
  }

  function startGrid(rng = Math.random) {
    return addRandomTile(addRandomTile(createGrid(), rng), rng);
  }

  return { SIZE, createGrid, slideRow, move, emptyCells, addRandomTile, startGrid, canMove, hasWon };
});
