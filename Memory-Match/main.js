(function () {
  const { createGame, flip, hideOpen, isComplete, isBetter } = window.MemoryRules;

  const gridEl = document.getElementById('grid');
  const statusEl = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game');
  const movesEl = document.getElementById('moves');
  const timeEl = document.getElementById('time');
  const bestEl = document.getElementById('best');
  const BEST_KEY = 'games-memory-best';

  const MISMATCH_DELAY = 800;
  const COLUMNS = 4;

  let game;
  let hideTimer = null;
  let buttons = [];
  let focusIndex = 0;
  let startedAt = null;
  let elapsed = 0;
  let clock = null;
  let best = readBest();

  function readBest() {
    try {
      const saved = JSON.parse(localStorage.getItem(BEST_KEY));
      if (saved && Number.isFinite(saved.moves) && Number.isFinite(saved.seconds)) return saved;
    } catch (err) {
      return null;
    }
    return null;
  }

  function saveBest(score) {
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(score));
    } catch (err) {
      return;
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function updateStats() {
    movesEl.textContent = String(game.moves);
    timeEl.textContent = formatTime(elapsed);
    bestEl.textContent = best ? best.moves + ' moves, ' + formatTime(best.seconds) : 'none yet';
  }

  function startClock() {
    startedAt = Date.now();
    clock = setInterval(() => {
      elapsed = Math.floor((Date.now() - startedAt) / 1000);
      updateStats();
    }, 250);
  }

  function stopClock() {
    clearInterval(clock);
    clock = null;
    if (startedAt !== null) elapsed = Math.floor((Date.now() - startedAt) / 1000);
  }

  function build() {
    gridEl.textContent = '';
    buttons = game.cards.map((card, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.dataset.index = String(i);
      const inner = document.createElement('span');
      inner.className = 'card-inner';
      inner.setAttribute('aria-hidden', 'true');
      const back = document.createElement('span');
      back.className = 'side back';
      const front = document.createElement('span');
      front.className = 'side front';
      front.textContent = card.glyph;
      inner.append(back, front);
      btn.appendChild(inner);
      btn.tabIndex = i === focusIndex ? 0 : -1;
      btn.addEventListener('click', () => choose(i));
      btn.addEventListener('keydown', (event) => onCardKey(event, i));
      btn.addEventListener('focus', () => setFocusIndex(i));
      gridEl.appendChild(btn);
      return btn;
    });
  }

  function render() {
    game.cards.forEach((card, i) => {
      const btn = buttons[i];
      const shown = card.matched || game.open.includes(i);
      btn.classList.toggle('is-open', shown);
      btn.classList.toggle('is-matched', card.matched);
      const label = 'Card ' + (i + 1) + ', ' + (card.matched ? card.key + ', matched' : shown ? card.key : 'face down');
      btn.setAttribute('aria-label', label);
    });
  }

  function setFocusIndex(index) {
    focusIndex = index;
    buttons.forEach((btn, i) => {
      btn.tabIndex = i === index ? 0 : -1;
    });
  }

  function onCardKey(event, index) {
    const count = buttons.length;
    let next = null;
    if (event.key === 'ArrowRight') next = index + 1;
    else if (event.key === 'ArrowLeft') next = index - 1;
    else if (event.key === 'ArrowDown') next = index + COLUMNS;
    else if (event.key === 'ArrowUp') next = index - COLUMNS;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    if (next === null) return;
    event.preventDefault();
    if (next < 0 || next >= count) return;
    setFocusIndex(next);
    buttons[next].focus();
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function settle() {
    clearTimeout(hideTimer);
    hideTimer = null;
    game = hideOpen(game);
    render();
  }

  function choose(index) {
    if (hideTimer !== null) settle();
    const outcome = flip(game, index);
    if (outcome.result === 'ignored') return;
    if (startedAt === null) startClock();
    game = outcome.game;
    render();
    updateStats();
    if (outcome.result === 'mismatch') {
      hideTimer = setTimeout(settle, MISMATCH_DELAY);
    } else if (outcome.result === 'match' && isComplete(game)) {
      stopClock();
      const score = { moves: game.moves, seconds: elapsed };
      const record = isBetter(score, best);
      if (record) {
        best = score;
        saveBest(best);
      }
      updateStats();
      announce('All pairs found in ' + game.moves + ' moves and ' + formatTime(elapsed) + '.' + (record ? ' New best!' : ''));
    }
  }

  function newGame() {
    clearTimeout(hideTimer);
    hideTimer = null;
    stopClock();
    startedAt = null;
    elapsed = 0;
    focusIndex = 0;
    game = createGame();
    announce('');
    build();
    render();
    updateStats();
  }

  newGameBtn.addEventListener('click', newGame);

  newGame();
})();
