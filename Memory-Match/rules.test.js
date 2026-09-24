const test = require('node:test');
const assert = require('node:assert/strict');
const { SYMBOLS, shuffle, createDeck, createGame, flip, hideOpen, isComplete, isBetter } = require('./rules.js');

function orderedGame() {
  return createGame(SYMBOLS, () => 0.999999);
}

function pairOf(game, index) {
  return game.cards.findIndex((c, i) => i !== index && c.key === game.cards[index].key);
}

function otherThan(game, index) {
  return game.cards.findIndex((c) => c.key !== game.cards[index].key);
}

test('the deck has two of every symbol', () => {
  const deck = createDeck();
  assert.equal(deck.length, SYMBOLS.length * 2);
  for (const symbol of SYMBOLS) {
    assert.equal(deck.filter((c) => c.key === symbol.key).length, 2);
  }
});

test('shuffle keeps every item and leaves the input alone', () => {
  const input = [1, 2, 3, 4, 5, 6];
  const out = shuffle(input, () => 0);
  assert.deepEqual(input, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(out.slice().sort(), input);
  assert.notDeepEqual(out, input);
});

test('flipping two matching cards marks them matched and counts a move', () => {
  let game = orderedGame();
  const b = pairOf(game, 0);
  game = flip(game, 0).game;
  const outcome = flip(game, b);
  assert.equal(outcome.result, 'match');
  assert.equal(outcome.game.moves, 1);
  assert.equal(outcome.game.matches, 1);
  assert.deepEqual(outcome.game.open, []);
  assert.ok(outcome.game.cards[0].matched && outcome.game.cards[b].matched);
});

test('a mismatch keeps both cards open until hidden', () => {
  let game = orderedGame();
  const b = otherThan(game, 0);
  game = flip(game, 0).game;
  const outcome = flip(game, b);
  assert.equal(outcome.result, 'mismatch');
  assert.deepEqual(outcome.game.open, [0, b]);
  assert.equal(outcome.game.moves, 1);
  assert.deepEqual(hideOpen(outcome.game).open, []);
});

test('a third card cannot be opened while two are showing', () => {
  let game = orderedGame();
  const b = otherThan(game, 0);
  game = flip(flip(game, 0).game, b).game;
  const third = game.cards.findIndex((_, i) => i !== 0 && i !== b);
  assert.equal(flip(game, third).result, 'ignored');
});

test('flipping the same card twice does not count as a move', () => {
  let game = orderedGame();
  game = flip(game, 3).game;
  const again = flip(game, 3);
  assert.equal(again.result, 'ignored');
  assert.equal(again.game.moves, 0);
});

test('matched cards and out of range indexes are ignored', () => {
  let game = orderedGame();
  const b = pairOf(game, 0);
  game = flip(flip(game, 0).game, b).game;
  assert.equal(flip(game, 0).result, 'ignored');
  assert.equal(flip(game, 99).result, 'ignored');
});

test('the game is complete once every pair is found', () => {
  let game = orderedGame();
  assert.equal(isComplete(game), false);
  for (let i = 0; i < game.cards.length; i++) {
    if (game.cards[i].matched) continue;
    game = flip(game, i).game;
    game = flip(game, pairOf(game, i)).game;
  }
  assert.equal(isComplete(game), true);
  assert.equal(game.moves, SYMBOLS.length);
});

test('fewer moves wins, and time breaks a tie', () => {
  assert.equal(isBetter({ moves: 10, seconds: 50 }, null), true);
  assert.equal(isBetter({ moves: 9, seconds: 90 }, { moves: 10, seconds: 20 }), true);
  assert.equal(isBetter({ moves: 10, seconds: 19 }, { moves: 10, seconds: 20 }), true);
  assert.equal(isBetter({ moves: 10, seconds: 20 }, { moves: 10, seconds: 20 }), false);
  assert.equal(isBetter({ moves: 11, seconds: 5 }, { moves: 10, seconds: 20 }), false);
});
