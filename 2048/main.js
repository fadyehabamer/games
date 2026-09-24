(function () {
  const { move, addRandomTile, startGrid, canMove, hasWon } = window.Rules2048;

  const boardEl = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game');
  const undoBtn = document.getElementById('undo');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlayEl = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const keepGoingBtn = document.getElementById('keep-going');
  const tryAgainBtn = document.getElementById('try-again');
  const statusEl = document.getElementById('status');
  const BEST_KEY = 'games-2048-best';

  const KEYS = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down'
  };

  let grid;
  let score = 0;
  let best = readBest();
  let state = 'playing';
  let keepPlaying = false;
  let previous = null;

  function readBest() {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch (err) {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch (err) {
      return;
    }
  }

  function tileClass(value) {
    if (!value) return 'tile';
    return 'tile tile-' + (value > 2048 ? 'super' : value);
  }

  function render(fresh, merged) {
    boardEl.textContent = '';
    const mergedKeys = new Set((merged || []).map(([r, c]) => r + ':' + c));
    grid.forEach((row, r) => row.forEach((value, c) => {
      const cell = document.createElement('div');
      cell.className = tileClass(value);
      if (fresh && fresh[0] === r && fresh[1] === c) cell.classList.add('tile-new');
      if (mergedKeys.has(r + ':' + c)) cell.classList.add('tile-merged');
      cell.textContent = value ? String(value) : '';
      boardEl.appendChild(cell);
    }));
    undoBtn.disabled = previous === null;
    scoreEl.textContent = String(score);
    bestEl.textContent = String(best);
  }

  function showOverlay(message, canContinue) {
    overlayText.textContent = message;
    keepGoingBtn.hidden = !canContinue;
    overlayEl.hidden = false;
    (canContinue ? keepGoingBtn : tryAgainBtn).focus();
  }

  function hideOverlay() {
    overlayEl.hidden = true;
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function checkEnd() {
    if (!keepPlaying && hasWon(grid)) {
      state = 'won';
      announce('You reached 2048 with a score of ' + score + '.');
      showOverlay('You made 2048!', true);
    } else if (!canMove(grid)) {
      state = 'over';
      announce('No moves left. Final score ' + score + '.');
      showOverlay('Game over', false);
    }
  }

  function findNewTile(before, after) {
    for (let r = 0; r < after.length; r++) {
      for (let c = 0; c < after[r].length; c++) {
        if (before[r][c] === 0 && after[r][c] !== 0) return [r, c];
      }
    }
    return null;
  }

  function play(direction) {
    if (state !== 'playing') return;
    const result = move(grid, direction);
    if (!result.moved) return;
    previous = { grid, score };
    grid = addRandomTile(result.grid);
    const fresh = findNewTile(result.grid, grid);
    score += result.gained;
    if (score > best) {
      best = score;
      saveBest(best);
    }
    render(fresh, result.merged);
    checkEnd();
  }

  function newGame() {
    grid = startGrid();
    score = 0;
    previous = null;
    state = 'playing';
    keepPlaying = false;
    hideOverlay();
    announce('');
    render();
  }

  function undo() {
    if (!previous) return;
    grid = previous.grid;
    score = previous.score;
    previous = null;
    if (state !== 'playing') {
      state = 'playing';
      hideOverlay();
      boardEl.focus();
    }
    announce('Last move undone.');
    render();
  }

  document.addEventListener('keydown', (event) => {
    if ((event.key === 'u' || event.key === 'U') && !event.ctrlKey && !event.metaKey && !event.altKey) {
      undo();
      return;
    }
    const direction = KEYS[event.key];
    if (!direction) return;
    event.preventDefault();
    play(direction);
  });

  const SWIPE_MIN = 24;
  let swipeStart = null;

  boardEl.addEventListener('pointerdown', (event) => {
    swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });

  boardEl.addEventListener('pointerup', (event) => {
    if (!swipeStart || swipeStart.id !== event.pointerId) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      play(dx > 0 ? 'right' : 'left');
    } else {
      play(dy > 0 ? 'down' : 'up');
    }
  });

  boardEl.addEventListener('pointercancel', () => {
    swipeStart = null;
  });

  newGameBtn.addEventListener('click', newGame);
  undoBtn.addEventListener('click', undo);
  tryAgainBtn.addEventListener('click', () => {
    newGame();
    boardEl.focus();
  });
  keepGoingBtn.addEventListener('click', () => {
    keepPlaying = true;
    state = 'playing';
    hideOverlay();
    announce('Keep going. Try for a bigger tile.');
    boardEl.focus();
  });

  newGame();
})();
