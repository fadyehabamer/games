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

  return { WORD_LENGTH, MAX_GUESSES, LETTERS, WORDS, normalizeLetter, isLetter, isValidGuess, scoreGuess };
});
