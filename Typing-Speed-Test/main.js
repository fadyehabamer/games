(function () {
  const { PASSAGES, charStates, toRuns, countNewInput, stats, isFinished } = window.TypingRules;

  const passageEl = document.getElementById('passage');
  const inputEl = document.getElementById('input');
  const wpmEl = document.getElementById('wpm');
  const accuracyEl = document.getElementById('accuracy');
  const timeEl = document.getElementById('time');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restart');
  const nextBtn = document.getElementById('next');

  const LANGS = {
    en: { lang: 'en', dir: 'ltr' },
    ar: { lang: 'ar', dir: 'rtl' }
  };

  let language = 'en';
  let target = '';
  let previous = '';
  let keystrokes = 0;
  let mistakes = 0;
  let startedAt = null;
  let finishedAt = null;
  let ticker = null;

  function elapsed() {
    if (startedAt === null) return 0;
    return (finishedAt || Date.now()) - startedAt;
  }

  function updateStats() {
    const result = stats({ target, typed: inputEl.value, elapsedMs: elapsed(), keystrokes, mistakes });
    wpmEl.textContent = String(result.wpm);
    accuracyEl.textContent = result.accuracy + '%';
    timeEl.textContent = Math.floor(elapsed() / 1000) + 's';
    return result;
  }

  function pickPassage(avoid) {
    const list = PASSAGES[language].filter((p) => p !== avoid);
    return list[Math.floor(Math.random() * list.length)];
  }

  function applyLanguage() {
    const info = LANGS[language];
    [passageEl, inputEl].forEach((el) => {
      el.lang = info.lang;
      el.dir = info.dir;
    });
  }

  function reset(passage) {
    clearInterval(ticker);
    target = passage;
    previous = '';
    keystrokes = 0;
    mistakes = 0;
    startedAt = null;
    finishedAt = null;
    inputEl.readOnly = false;
    inputEl.value = '';
    statusEl.textContent = '';
    applyLanguage();
    render();
    updateStats();
  }

  function render() {
    const typed = inputEl.value;
    passageEl.textContent = '';
    toRuns(target, charStates(target, typed)).forEach((run) => {
      const span = document.createElement('span');
      span.className = run.state;
      span.textContent = run.text;
      passageEl.appendChild(span);
    });
  }

  function finish() {
    finishedAt = Date.now();
    clearInterval(ticker);
    inputEl.readOnly = true;
    const result = updateStats();
    const seconds = Math.round(elapsed() / 1000);
    statusEl.textContent = 'Done: ' + result.wpm + ' WPM at ' + result.accuracy + '% accuracy in ' + seconds + ' seconds. Press Escape or Restart to try again.';
  }

  function restart() {
    reset(target);
    inputEl.focus();
  }

  function nextPassage() {
    reset(pickPassage(target));
    inputEl.focus();
  }

  inputEl.addEventListener('input', () => {
    if (finishedAt !== null) return;
    if (inputEl.value.length > target.length) {
      inputEl.value = inputEl.value.slice(0, target.length);
    }
    const typed = inputEl.value;
    if (startedAt === null && typed.length > 0) {
      startedAt = Date.now();
      ticker = setInterval(updateStats, 500);
    }
    const added = countNewInput(target, previous, typed);
    keystrokes += added.keystrokes;
    mistakes += added.mistakes;
    previous = typed;
    render();
    updateStats();
    if (isFinished(target, typed)) finish();
  });

  inputEl.addEventListener('paste', (event) => event.preventDefault());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      restart();
    }
  });

  restartBtn.addEventListener('click', restart);
  nextBtn.addEventListener('click', nextPassage);

  document.querySelectorAll('input[name="lang"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      language = radio.value;
      reset(pickPassage());
    });
  });

  const checked = document.querySelector('input[name="lang"]:checked');
  language = checked ? checked.value : 'en';
  reset(pickPassage());
})();
