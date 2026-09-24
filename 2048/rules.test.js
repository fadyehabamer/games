const test = require('node:test');
const assert = require('node:assert/strict');
const { slideRow, move, addRandomTile, canMove, hasWon, createGrid, emptyCells, startGrid } = require('./rules.js');

function seq(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

test('slideRow packs tiles to the left', () => {
  assert.deepEqual(slideRow([0, 2, 0, 4]).row, [2, 4, 0, 0]);
});

test('slideRow merges a pair once', () => {
  const result = slideRow([2, 2, 0, 0]);
  assert.deepEqual(result.row, [4, 0, 0, 0]);
  assert.equal(result.gained, 4);
});

test('four equal tiles become two merged tiles, not one', () => {
  assert.deepEqual(slideRow([2, 2, 2, 2]).row, [4, 4, 0, 0]);
});

test('a freshly merged tile does not merge again in the same move', () => {
  assert.deepEqual(slideRow([4, 4, 8, 0]).row, [8, 8, 0, 0]);
  assert.deepEqual(slideRow([2, 2, 4, 0]).row, [4, 4, 0, 0]);
});

test('three equal tiles merge the leading pair', () => {
  assert.deepEqual(slideRow([2, 2, 2, 0]).row, [4, 2, 0, 0]);
  assert.deepEqual(slideRow([0, 2, 2, 2]).row, [4, 2, 0, 0]);
});

test('tiles separated by gaps still merge', () => {
  assert.deepEqual(slideRow([2, 0, 0, 2]).row, [4, 0, 0, 0]);
});

test('different values do not merge', () => {
  const result = slideRow([2, 4, 8, 16]);
  assert.deepEqual(result.row, [2, 4, 8, 16]);
  assert.equal(result.gained, 0);
});

test('move right merges toward the right edge', () => {
  const grid = [
    [2, 2, 2, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  assert.deepEqual(move(grid, 'right').grid[0], [0, 0, 2, 4]);
});

test('move up and down work on columns', () => {
  const grid = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0]
  ];
  const up = move(grid, 'up');
  assert.deepEqual(up.grid.map((row) => row[0]), [4, 8, 0, 0]);
  assert.equal(up.gained, 12);
  const down = move(grid, 'down');
  assert.deepEqual(down.grid.map((row) => row[0]), [0, 0, 4, 8]);
  assert.deepEqual(down.merged, [[3, 0], [2, 0]]);
});

test('move reports whether anything changed', () => {
  const grid = [
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  assert.equal(move(grid, 'left').moved, false);
  assert.equal(move(grid, 'right').moved, true);
});

test('move does not mutate the input grid', () => {
  const grid = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const copy = JSON.stringify(grid);
  move(grid, 'left');
  assert.equal(JSON.stringify(grid), copy);
});

test('move rejects an unknown direction', () => {
  assert.throws(() => move(createGrid(), 'sideways'));
});

test('addRandomTile fills an empty cell with a 2 or a 4', () => {
  const grid = createGrid();
  const two = addRandomTile(grid, seq([0, 0.5]));
  assert.equal(two[0][0], 2);
  const four = addRandomTile(grid, seq([0.99, 0.95]));
  assert.equal(four[3][3], 4);
  assert.equal(emptyCells(grid).length, 16);
});

test('startGrid places two tiles', () => {
  assert.equal(emptyCells(startGrid()).length, 14);
});

test('canMove is false only for a full board with no equal neighbours', () => {
  const stuck = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2]
  ];
  assert.equal(canMove(stuck), false);
  const pair = stuck.map((row) => row.slice());
  pair[3][3] = 4;
  assert.equal(canMove(pair), true);
  const gap = stuck.map((row) => row.slice());
  gap[1][1] = 0;
  assert.equal(canMove(gap), true);
});

test('hasWon looks for a 2048 tile', () => {
  const grid = createGrid();
  assert.equal(hasWon(grid), false);
  grid[2][1] = 2048;
  assert.equal(hasWon(grid), true);
});
