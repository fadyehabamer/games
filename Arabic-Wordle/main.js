(function () {
  const { WORD_LENGTH, MAX_GUESSES, WORDS, scoreGuess, isValidGuess } = window.WordleRules;

  const boardEl = document.getElementById('board');
  const keyboardEl = document.getElementById('keyboard');
  const statusEl = document.getElementById('status');

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

  let answer = WORDS[Math.floor(Math.random() * WORDS.length)];
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
    render();
    if (guess === answer) {
      finished = true;
      announce('أحسنت! عرفت الكلمة في ' + guesses.length + ' من ' + MAX_GUESSES + '.');
    } else if (guesses.length === MAX_GUESSES) {
      finished = true;
      announce('انتهت المحاولات. الكلمة كانت: ' + answer + '.');
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

  buildBoard();
  buildKeyboard();
  render();
})();
