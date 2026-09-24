const test = require('node:test');
const assert = require('node:assert/strict');
const {
  emptyBoard, winner, isFull, play, nextPlayer, availableMoves,
  bestMove, randomMove, computerMove, other
} = require('./rules.js');

function board(layout) {
  return layout.split('').map((c) => (c === '.' ? null : c));
}

function playAllReplies(start, ai) {
  const counts = { games: 0, aiWins: 0, draws: 0, losses: 0 };
  function explore(state) {
    const win = winner(state);
    if (win || isFull(state)) {
      counts.games++;
      if (!win) counts.draws++;
      else if (win.player === ai) counts.aiWins++;
      else counts.losses++;
      return;
    }
    if (nextPlayer(state) === ai) {
      explore(play(state, bestMove(state, ai), ai));
      return;
    }
    for (const i of availableMoves(state)) explore(play(state, i, other(ai)));
  }
  explore(start);
  return counts;
}

test('winner finds rows, columns and diagonals', () => {
  assert.deepEqual(winner(board('XXX......')), { player: 'X', line: [0, 1, 2] });
  assert.deepEqual(winner(board('O..O..O..')), { player: 'O', line: [0, 3, 6] });
  assert.deepEqual(winner(board('..X.X.X..')), { player: 'X', line: [2, 4, 6] });
  assert.equal(winner(board('XOXXOOOXX')), null);
});

test('a full board with no line is a draw', () => {
  const b = board('XOXXOOOXX');
  assert.equal(isFull(b), true);
  assert.equal(winner(b), null);
});

test('X always moves first and turns alternate', () => {
  assert.equal(nextPlayer(emptyBoard()), 'X');
  assert.equal(nextPlayer(board('X........')), 'O');
  assert.equal(nextPlayer(board('XO.......')), 'X');
});

test('play refuses a taken square and leaves the input alone', () => {
  const b = board('X........');
  assert.throws(() => play(b, 0, 'O'));
  const next = play(b, 4, 'O');
  assert.equal(b[4], null);
  assert.equal(next[4], 'O');
});

test('the computer takes a winning move when it has one', () => {
  assert.equal(bestMove(board('OO.XX.X..'), 'O'), 2);
});

test('the computer blocks an immediate threat', () => {
  assert.equal(bestMove(board('XX..O....'), 'O'), 2);
  assert.equal(bestMove(board('X..OX....'), 'O'), 8);
});

test('minimax never loses when it moves first', () => {
  const counts = playAllReplies(emptyBoard(), 'X');
  assert.equal(counts.losses, 0);
  assert.ok(counts.games > 0);
});

test('minimax never loses when it moves second, against every possible reply', () => {
  const counts = playAllReplies(emptyBoard(), 'O');
  assert.equal(counts.losses, 0);
  assert.ok(counts.aiWins > 0);
  assert.ok(counts.draws > 0);
});

test('perfect play against perfect play is a draw', () => {
  let b = emptyBoard();
  while (!winner(b) && !isFull(b)) {
    const p = nextPlayer(b);
    b = play(b, bestMove(b, p), p);
  }
  assert.equal(winner(b), null);
});

test('easy mode picks any free square', () => {
  const b = board('XOX.O.X..');
  const free = availableMoves(b);
  assert.equal(randomMove(b, () => 0), free[0]);
  assert.equal(randomMove(b, () => 0.99), free[free.length - 1]);
  assert.equal(computerMove(b, 'O', 'easy', () => 0), free[0]);
  assert.equal(randomMove(board('XOXXOOOXX')), null);
});

test('hard mode uses minimax', () => {
  const b = board('XX..O....');
  assert.equal(computerMove(b, 'O', 'hard'), bestMove(b, 'O'));
});
