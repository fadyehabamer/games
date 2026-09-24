(function () {
  const { WORD_LENGTH, MAX_GUESSES, scoreGuess, isValidGuess, letterFromKey, dayNumber, dailyWord } = window.WordleRules;

  const boardEl = document.getElementById('board');
  const keyboardEl = document.getElementById('keyboard');
  const statusEl = document.getElementById('status');
  const puzzleEl = document.getElementById('puzzle');
  const SAVE_KEY = 'games-arabic-wordle';

  const KEY_ROWS = [
    Array.from('ضصثقفغعهخحجد'),
    Array.from('شسيبلاتنمكطذ'),
    ['enter'].concat(Array.from('ئءؤرىةوزظ'), ['backspace'])
  ];

  const RESULT_LABELS = {
    correct: 'في مكانه الصحيح',
    present: 'موجود في مكان آخر',
    absent: 'غير موجود'
  };

  const today = new Date();
  const day = dayNumber(today);
  const answer = dailyWord(today);
  let guesses = [];
  let current = [];
  let finished = false;
  const tiles = [];

  function buildBoard() {
    for (let r = 0; r < MAX_GUESSES; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', 'المحاولة ' + (r + 1));
      const rowTiles = [];
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        row.appendChild(tile);
        rowTiles.push(tile);
      }
      boardEl.appendChild(row);
      tiles.push(rowTiles);
    }
  }

  function buildKeyboard() {
    KEY_ROWS.forEach((keys) => {
      const row = document.createElement('div');
      row.className = 'key-row';
      keys.forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'key';
        btn.dataset.key = key;
        if (key === 'enter') {
          btn.textContent = 'إدخال';
          btn.classList.add('wide');
        } else if (key === 'backspace') {
          btn.textContent = '⌫';
          btn.setAttribute('aria-label', 'حذف حرف');
          btn.classList.add('wide');
        } else {
          btn.textContent = key;
        }
        btn.addEventListener('click', () => press(key));
        row.appendChild(btn);
      });
      keyboardEl.appendChild(row);
    });
  }

  function render() {
    for (let r = 0; r < MAX_GUESSES; r++) {
      const guess = guesses[r];
      const letters = guess ? Array.from(guess) : r === guesses.length ? current : [];
      const result = guess ? scoreGuess(guess, answer) : null;
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = tiles[r][c];
        const letter = letters[c] || '';
        tile.textContent = letter;
        tile.className = 'tile' + (letter ? ' filled' : '') + (result ? ' ' + result[c] : '');
        if (result) tile.setAttribute('aria-label', letter + '، ' + RESULT_LABELS[result[c]]);
        else tile.removeAttribute('aria-label');
      }
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ day, guesses }));
    } catch (err) {
      return;
    }
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && saved.day === day && Array.isArray(saved.guesses)) {
        guesses = saved.guesses.filter(isValidGuess).slice(0, MAX_GUESSES);
      }
    } catch (err) {
      guesses = [];
    }
  }

  function endMessage() {
    if (guesses[guesses.length - 1] === answer) {
      return 'أحسنت! عرفت الكلمة في ' + guesses.length + ' من ' + MAX_GUESSES + '. عد غدا لكلمة جديدة.';
    }
    return 'انتهت المحاولات. الكلمة كانت: ' + answer + '. عد غدا لكلمة جديدة.';
  }

  function checkFinished() {
    finished = guesses.includes(answer) || guesses.length >= MAX_GUESSES;
    return finished;
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function describe(guess) {
    const result = scoreGuess(guess, answer);
    return Array.from(guess).map((letter, i) => letter + ' ' + RESULT_LABELS[result[i]]).join('، ');
  }

  function submit() {
    if (current.length < WORD_LENGTH) {
      announce('أكمل خمسة أحرف أولا.');
      return;
    }
    const guess = current.join('');
    if (!isValidGuess(guess)) {
      announce('هذه ليست كلمة صالحة.');
      return;
    }
    guesses.push(guess);
    current = [];
    save();
    render();
    if (checkFinished()) {
      announce(endMessage());
    } else {
      announce(describe(guess));
    }
  }

  function press(key) {
    if (finished) return;
    if (key === 'enter') {
      submit();
    } else if (key === 'backspace') {
      current.pop();
      render();
    } else if (current.length < WORD_LENGTH) {
      current.push(key);
      render();
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const onButton = event.target instanceof HTMLElement && event.target.closest('button');
    if (event.key === 'Enter') {
      if (onButton) return;
      event.preventDefault();
      press('enter');
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      press('backspace');
      return;
    }
    const letter = letterFromKey(event.key, event.code);
    if (letter) {
      event.preventDefault();
      press(letter);
    }
  });

  puzzleEl.textContent = 'كلمة اليوم رقم ' + (day + 1);
  restore();
  buildBoard();
  buildKeyboard();
  render();
  if (checkFinished()) announce(endMessage());
})();
