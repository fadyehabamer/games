const test = require('node:test');
const assert = require('node:assert/strict');
const { createState, turn, step, tickDelay, placeFood, MAX_QUEUE, MIN_DELAY, BASE_DELAY } = require('./rules.js');

function stateWith(overrides) {
  return { ...createState({ cols: 10, rows: 10, rng: () => 0 }), ...overrides };
}

test('new game starts with a three part snake heading right', () => {
  const state = createState({ cols: 20, rows: 20 });
  assert.equal(state.snake.length, 3);
  assert.equal(state.dir, 'right');
  assert.deepEqual(state.snake[0], { x: 10, y: 10 });
  assert.ok(state.food);
  assert.ok(!state.snake.some((p) => p.x === state.food.x && p.y === state.food.y));
});

test('step moves the head one cell and drops the tail', () => {
  const state = stateWith({ food: { x: 0, y: 0 } });
  const next = step(state);
  assert.deepEqual(next.snake, [{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
  assert.equal(next.over, false);
});

test('turning straight back is ignored', () => {
  const state = stateWith({ food: { x: 0, y: 0 } });
  const turned = turn(state, 'left');
  assert.deepEqual(turned.queue, []);
  assert.equal(step(turned).over, false);
});

test('two quick turns cannot reverse the snake inside one tick', () => {
  let state = stateWith({ food: { x: 0, y: 0 } });
  state = turn(state, 'up');
  state = turn(state, 'left');
  state = step(state);
  assert.equal(state.over, false);
  assert.deepEqual(state.snake[0], { x: 5, y: 4 });
  state = step(state);
  assert.equal(state.over, false);
  assert.deepEqual(state.snake[0], { x: 4, y: 4 });
});

test('a queued turn is checked against the previous queued turn', () => {
  let state = stateWith({ food: { x: 0, y: 0 } });
  state = turn(state, 'up');
  state = turn(state, 'down');
  assert.deepEqual(state.queue, ['up']);
});

test('the turn queue is capped', () => {
  let state = stateWith({ food: { x: 0, y: 0 } });
  for (const dir of ['up', 'left', 'down', 'right', 'up']) state = turn(state, dir);
  assert.equal(state.queue.length, MAX_QUEUE);
});

test('unknown directions are ignored', () => {
  const state = stateWith({});
  assert.equal(turn(state, 'diagonal'), state);
});

test('eating food grows the snake and scores a point', () => {
  const state = stateWith({ food: { x: 6, y: 5 } });
  const next = step(state, () => 0);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.notDeepEqual(next.food, { x: 6, y: 5 });
});

test('hitting a wall ends the game', () => {
  const state = stateWith({ snake: [{ x: 9, y: 0 }, { x: 8, y: 0 }], food: { x: 0, y: 9 } });
  const next = step(state);
  assert.equal(next.over, true);
  assert.equal(next.won, false);
});

test('running into the body ends the game', () => {
  const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
  const state = stateWith({ snake, dir: 'up', food: { x: 0, y: 0 } });
  const next = step(turn(state, 'right'));
  assert.equal(next.over, true);
});

test('moving into the cell the tail is leaving is allowed', () => {
  const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }];
  const state = stateWith({ snake, dir: 'left', food: { x: 0, y: 0 } });
  const next = step(turn(state, 'down'));
  assert.equal(next.over, false);
  assert.deepEqual(next.snake[0], { x: 5, y: 6 });
});

test('step does nothing once the game is over', () => {
  const state = stateWith({ over: true });
  assert.equal(step(state), state);
});

test('filling the board wins', () => {
  const state = {
    cols: 2,
    rows: 2,
    snake: [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
    dir: 'right',
    queue: [],
    food: { x: 1, y: 1 },
    score: 0,
    over: false,
    won: false
  };
  const next = step(state);
  assert.equal(next.won, true);
  assert.equal(next.over, true);
  assert.equal(placeFood(next), null);
});

test('the game speeds up with the score but never below the floor', () => {
  assert.equal(tickDelay(0), BASE_DELAY);
  assert.ok(tickDelay(5) < tickDelay(0));
  assert.equal(tickDelay(1000), MIN_DELAY);
});
