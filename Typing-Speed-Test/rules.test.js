const test = require('node:test');
const assert = require('node:assert/strict');
const { PASSAGES, charStates, toRuns, countNewInput, correctCount, stats, isFinished } = require('./rules.js');

test('there are English and Arabic passages', () => {
  assert.ok(PASSAGES.en.length >= 2);
  assert.ok(PASSAGES.ar.length >= 2);
  for (const passage of PASSAGES.ar) {
    assert.match(passage, /^[؀-ۿ\s.,،]+$/);
  }
});

test('charStates marks correct, incorrect, current and pending characters', () => {
  assert.deepEqual(charStates('cat', ''), ['current', 'pending', 'pending']);
  assert.deepEqual(charStates('cat', 'cu'), ['correct', 'incorrect', 'current']);
  assert.deepEqual(charStates('cat', 'cat'), ['correct', 'correct', 'correct']);
});

test('toRuns groups neighbouring characters with the same state', () => {
  const target = 'hello';
  const runs = toRuns(target, charStates(target, 'hx'));
  assert.deepEqual(runs, [
    { state: 'correct', text: 'h' },
    { state: 'incorrect', text: 'e' },
    { state: 'current', text: 'l' },
    { state: 'pending', text: 'lo' }
  ]);
  assert.equal(runs.map((r) => r.text).join(''), target);
});

test('toRuns keeps Arabic words whole when they are all correct', () => {
  const target = 'مرحبا بكم';
  const runs = toRuns(target, charStates(target, 'مرحبا'));
  assert.equal(runs[0].text, 'مرحبا');
  assert.equal(runs[0].state, 'correct');
});

test('countNewInput counts only the characters that were added', () => {
  assert.deepEqual(countNewInput('hello', 'he', 'hel'), { keystrokes: 1, mistakes: 0 });
  assert.deepEqual(countNewInput('hello', 'he', 'hex'), { keystrokes: 1, mistakes: 1 });
  assert.deepEqual(countNewInput('hello', 'hex', 'he'), { keystrokes: 0, mistakes: 0 });
  assert.deepEqual(countNewInput('hello', 'hex', 'hel'), { keystrokes: 1, mistakes: 0 });
});

test('correctCount compares position by position', () => {
  assert.equal(correctCount('hello', 'hallo'), 4);
  assert.equal(correctCount('سلام', 'سلام'), 4);
  assert.equal(correctCount('سلام', 'سلم'), 2);
});

test('WPM counts five correct characters as a word', () => {
  const target = 'a'.repeat(100);
  const result = stats({ target, typed: 'a'.repeat(50), elapsedMs: 60000, keystrokes: 50, mistakes: 0 });
  assert.equal(result.wpm, 10);
  assert.equal(result.accuracy, 100);
});

test('mistakes lower accuracy even after they are fixed', () => {
  const result = stats({ target: 'abcd', typed: 'abcd', elapsedMs: 6000, keystrokes: 5, mistakes: 1 });
  assert.equal(result.accuracy, 80);
  assert.equal(result.wpm, 8);
});

test('no time and no typing gives zero WPM and full accuracy', () => {
  assert.deepEqual(stats({ target: 'abc', typed: '', elapsedMs: 0, keystrokes: 0, mistakes: 0 }), { wpm: 0, accuracy: 100, correct: 0 });
});

test('the test finishes when the whole passage is typed', () => {
  assert.equal(isFinished('abc', 'ab'), false);
  assert.equal(isFinished('abc', 'abx'), true);
});
