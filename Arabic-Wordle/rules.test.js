const test = require('node:test');
const assert = require('node:assert/strict');
const {
  WORDS, LETTERS, WORD_LENGTH, MAX_GUESSES, scoreGuess, isValidGuess, keyStates,
  dayNumber, dailyWord, letterFromKey, normalizeLetter, shareText
} = require('./rules.js');

test('every bundled word is five known letters and appears once', () => {
  for (const word of WORDS) {
    assert.equal(Array.from(word).length, WORD_LENGTH, word);
    assert.ok(isValidGuess(word), word);
  }
  assert.equal(new Set(WORDS).size, WORDS.length);
});

test('the word list has no diacritics or hamza-on-alef forms', () => {
  for (const word of WORDS) {
    assert.doesNotMatch(word, /[ً-ْأإآ]/, word);
  }
});

test('an exact match is all correct', () => {
  assert.deepEqual(scoreGuess('مدرسة', 'مدرسة'), Array(5).fill('correct'));
});

test('letters in the wrong place are present, missing ones absent', () => {
  assert.deepEqual(scoreGuess('سيارة', 'رسالة'), ['present', 'absent', 'correct', 'present', 'correct']);
});

test('a repeated guess letter is only marked once when the answer has it once', () => {
  assert.deepEqual(scoreGuess('ممتاز', 'مدرسة'), ['correct', 'absent', 'absent', 'absent', 'absent']);
  assert.deepEqual(scoreGuess('دجاجة', 'جامعة'), ['absent', 'present', 'present', 'absent', 'correct']);
});

test('a correct letter takes priority over an earlier copy of the same letter', () => {
  assert.deepEqual(scoreGuess('ببببب', 'حقيبة'), ['absent', 'absent', 'absent', 'correct', 'absent']);
});

test('both copies are credited when the answer has the letter twice', () => {
  assert.deepEqual(scoreGuess('مملكة', 'معلمة'), ['correct', 'present', 'correct', 'absent', 'correct']);
  assert.deepEqual(scoreGuess('دجاجة', 'جزيرة').filter((r) => r === 'present').length, 1);
});

test('guesses must be exactly five Arabic letters', () => {
  assert.equal(isValidGuess('مدرس'), false);
  assert.equal(isValidGuess('مدرستي'), false);
  assert.equal(isValidGuess('abcde'), false);
  assert.equal(isValidGuess('مد1سة'), false);
});

test('keyboard colours keep the best result seen for each letter', () => {
  const states = keyStates(['سيارة', 'رسالة'], 'رسالة');
  assert.equal(states['ر'], 'correct');
  assert.equal(states['س'], 'correct');
  assert.equal(states['ي'], 'absent');
  const once = keyStates(['ممتاز'], 'مدرسة');
  assert.equal(once['م'], 'correct');
});

test('the daily word changes at local midnight and repeats through the list', () => {
  const first = new Date(2026, 0, 1, 0, 5);
  const late = new Date(2026, 0, 1, 23, 55);
  const next = new Date(2026, 0, 2, 0, 5);
  assert.equal(dayNumber(first), 0);
  assert.equal(dailyWord(first), dailyWord(late));
  assert.equal(dayNumber(next), 1);
  assert.equal(dailyWord(next), WORDS[1]);
  assert.equal(dailyWord(new Date(2026, 0, 1 + WORDS.length)), WORDS[0]);
  assert.ok(WORDS.includes(dailyWord(new Date(2025, 5, 15))));
});

test('day numbers are not thrown off by daylight saving changes', () => {
  for (let d = 0; d < 400; d++) {
    assert.equal(dayNumber(new Date(2026, 0, 1 + d, 12)), d);
  }
});

test('physical keys map to Arabic letters', () => {
  assert.equal(letterFromKey('ب', 'KeyF'), 'ب');
  assert.equal(letterFromKey('f', 'KeyF'), 'ب');
  assert.equal(letterFromKey('F', 'KeyF'), 'ب');
  assert.equal(letterFromKey('m', 'KeyM'), 'ة');
  assert.equal(letterFromKey(';', 'Semicolon'), 'ك');
  assert.equal(letterFromKey('1', 'Digit1'), null);
  assert.equal(letterFromKey('Tab', 'Tab'), null);
});

test('alef with hamza or madda counts as a plain alef', () => {
  assert.equal(normalizeLetter('أ'), 'ا');
  assert.equal(normalizeLetter('إ'), 'ا');
  assert.equal(normalizeLetter('آ'), 'ا');
  assert.equal(letterFromKey('أ', 'KeyH'), 'ا');
});

test('the letter set is the 28 letters plus hamza forms, taa marbuta and alef maqsura', () => {
  assert.equal(LETTERS.length, 33);
  assert.equal(new Set(LETTERS).size, 33);
  for (const extra of ['ء', 'ئ', 'ؤ', 'ة', 'ى']) assert.ok(LETTERS.includes(extra), extra);
});

test('share text shows the day, the score and one square per letter', () => {
  const text = shareText(9, ['سيارة', 'رسالة'], 'رسالة');
  const lines = text.split('\n');
  assert.equal(lines[0], 'وردل عربي 10 2/' + MAX_GUESSES);
  assert.equal(lines[1], '');
  assert.equal(lines[2], '‏\u{1F7E8}⬛\u{1F7E9}\u{1F7E8}\u{1F7E9}');
  assert.equal(lines[3], '‏' + '\u{1F7E9}'.repeat(5));
  assert.doesNotMatch(text, /رسالة/);
});

test('a lost game shows X in the share text', () => {
  const guesses = Array(MAX_GUESSES).fill('مملكة');
  assert.match(shareText(0, guesses, 'مدرسة').split('\n')[0], / X\/6$/);
});
