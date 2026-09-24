(function () {
  const { move, addRandomTile, startGrid, canMove, hasWon } = window.Rules2048;

  const boardEl = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game');
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

  function render() {
    boardEl.textContent = '';
    grid.forEach((row) => row.forEach((value) => {
      const cell = document.createElement('div');
      cell.className = tileClass(value);
      cell.textContent = value ? String(value) : '';
      boardEl.appendChild(cell);
    }));
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

  function play(direction) {
    if (state !== 'playing') return;
    const result = move(grid, direction);
    if (!result.moved) return;
    grid = addRandomTile(result.grid);
    score += result.gained;
    if (score > best) {
      best = score;
      saveBest(best);
    }
    render();
    checkEnd();
  }

  function newGame() {
    grid = startGrid();
    score = 0;
    state = 'playing';
    keepPlaying = false;
    hideOverlay();
    announce('');
    render();
  }

  document.addEventListener('keydown', (event) => {
    const direction = KEYS[event.key];
    if (!direction) return;
    event.preventDefault();
    play(direction);
  });

  newGameBtn.addEventListener('click', newGame);
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
