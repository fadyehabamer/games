(function () {
  const { PASSAGES, charStates, toRuns, countNewInput, stats, isFinished } = window.TypingRules;

  const passageEl = document.getElementById('passage');
  const inputEl = document.getElementById('input');
  const wpmEl = document.getElementById('wpm');
  const accuracyEl = document.getElementById('accuracy');
  const timeEl = document.getElementById('time');

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

  function pickPassage() {
    const list = PASSAGES.en;
    return list[Math.floor(Math.random() * list.length)];
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
    updateStats();
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

  target = pickPassage();
  inputEl.value = '';
  render();
  updateStats();
})();
