(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.WordleRules = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;

  const LETTERS = Array.from('ابتثجحخدذرزسشصضطظعغفقكلمنهويءئؤةى');

  const WORDS = [
    'مدرسة', 'كتابة', 'مكتبة', 'سيارة', 'طائرة', 'حديقة', 'جامعة', 'مدينة',
    'عائلة', 'سعادة', 'رسالة', 'نافذة', 'ملعقة', 'حقيبة', 'جزيرة', 'سفينة',
    'بحيرة', 'مملكة', 'ممتاز', 'مسافر', 'معلمة', 'طبيعة', 'ذاكرة', 'تفاحة',
    'فراشة', 'ثلاجة', 'مفتاح', 'مصباح', 'صحراء', 'عصفور', 'دجاجة', 'بطاقة',
    'حكاية', 'مشروع', 'تاريخ', 'رياضة', 'ملابس', 'فستان', 'بستان', 'مهندس',
    'صابون', 'فنجان'
  ];

  const CODE_TO_LETTER = {
    KeyQ: 'ض', KeyW: 'ص', KeyE: 'ث', KeyR: 'ق', KeyT: 'ف', KeyY: 'غ',
    KeyU: 'ع', KeyI: 'ه', KeyO: 'خ', KeyP: 'ح', BracketLeft: 'ج', BracketRight: 'د',
    KeyA: 'ش', KeyS: 'س', KeyD: 'ي', KeyF: 'ب', KeyG: 'ل', KeyH: 'ا',
    KeyJ: 'ت', KeyK: 'ن', KeyL: 'م', Semicolon: 'ك', Quote: 'ط', Backquote: 'ذ',
    KeyZ: 'ئ', KeyX: 'ء', KeyC: 'ؤ', KeyV: 'ر', KeyN: 'ى', KeyM: 'ة',
    Comma: 'و', Period: 'ز', Slash: 'ظ'
  };

  function letterFromKey(key, code) {
    const letter = normalizeLetter(key);
    if (isLetter(letter)) return letter;
    if (/^[a-zA-Z;',.\/\[\]`]$/.test(key) && CODE_TO_LETTER[code]) return CODE_TO_LETTER[code];
    return null;
  }

  function normalizeLetter(letter) {
    if (letter === 'أ' || letter === 'إ' || letter === 'آ') return 'ا';
    return letter;
  }

  function isLetter(letter) {
    return LETTERS.includes(letter);
  }

  function isValidGuess(guess) {
    const letters = Array.from(guess);
    return letters.length === WORD_LENGTH && letters.every(isLetter);
  }

  const EPOCH = Date.UTC(2026, 0, 1);
  const DAY_MS = 24 * 60 * 60 * 1000;

  function dayNumber(date) {
    const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor((today - EPOCH) / DAY_MS);
  }

  function dailyWord(date, words = WORDS) {
    const n = dayNumber(date);
    return words[((n % words.length) + words.length) % words.length];
  }

  function scoreGuess(guess, answer) {
    const g = Array.from(guess);
    const a = Array.from(answer);
    const result = Array(g.length).fill('absent');
    const remaining = {};
    for (let i = 0; i < a.length; i++) {
      if (g[i] === a[i]) {
        result[i] = 'correct';
      } else {
        remaining[a[i]] = (remaining[a[i]] || 0) + 1;
      }
    }
    for (let i = 0; i < g.length; i++) {
      if (result[i] === 'correct') continue;
      if (remaining[g[i]] > 0) {
        result[i] = 'present';
        remaining[g[i]] -= 1;
      }
    }
    return result;
  }

  const RANK = { absent: 1, present: 2, correct: 3 };

  function keyStates(guesses, answer) {
    const states = {};
    guesses.forEach((guess) => {
      const result = scoreGuess(guess, answer);
      Array.from(guess).forEach((letter, i) => {
        if (!states[letter] || RANK[result[i]] > RANK[states[letter]]) states[letter] = result[i];
      });
    });
    return states;
  }

  const SQUARES = { correct: '\u{1F7E9}', present: '\u{1F7E8}', absent: '\u2B1B' };

  function shareText(day, guesses, answer) {
    const won = guesses.includes(answer);
    const header = 'وردل عربي ' + (day + 1) + ' ' + (won ? guesses.length : 'X') + '/' + MAX_GUESSES;
    const rows = guesses.map((guess) => '\u200F' + scoreGuess(guess, answer).map((r) => SQUARES[r]).join(''));
    return header + '\n\n' + rows.join('\n');
  }

  return { shareText, keyStates, WORD_LENGTH, MAX_GUESSES, LETTERS, WORDS, CODE_TO_LETTER, letterFromKey, normalizeLetter, isLetter, isValidGuess, scoreGuess, dayNumber, dailyWord };
});
