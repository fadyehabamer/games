(function () {
  const { createGame, flip, hideOpen, isComplete } = window.MemoryRules;

  const gridEl = document.getElementById('grid');
  const statusEl = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game');

  const MISMATCH_DELAY = 800;

  let game;
  let hideTimer = null;
  let buttons = [];

  function build() {
    gridEl.textContent = '';
    buttons = game.cards.map((card, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.dataset.index = String(i);
      const face = document.createElement('span');
      face.className = 'face';
      face.setAttribute('aria-hidden', 'true');
      btn.appendChild(face);
      btn.addEventListener('click', () => choose(i));
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
      btn.querySelector('.face').textContent = shown ? card.glyph : '';
      const label = 'Card ' + (i + 1) + ', ' + (card.matched ? card.key + ', matched' : shown ? card.key : 'face down');
      btn.setAttribute('aria-label', label);
    });
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
    game = outcome.game;
    render();
    if (outcome.result === 'mismatch') {
      hideTimer = setTimeout(settle, MISMATCH_DELAY);
    } else if (outcome.result === 'match' && isComplete(game)) {
      announce('All pairs found.');
    }
  }

  function newGame() {
    clearTimeout(hideTimer);
    hideTimer = null;
    game = createGame();
    announce('');
    build();
    render();
  }

  newGameBtn.addEventListener('click', newGame);

  newGame();
})();
