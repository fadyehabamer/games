(function () {
  const { move, addRandomTile, startGrid } = window.Rules2048;

  const boardEl = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
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

  function play(direction) {
    const result = move(grid, direction);
    if (!result.moved) return;
    grid = addRandomTile(result.grid);
    score += result.gained;
    if (score > best) {
      best = score;
      saveBest(best);
    }
    render();
  }

  function newGame() {
    grid = startGrid();
    score = 0;
    render();
  }

  document.addEventListener('keydown', (event) => {
    const direction = KEYS[event.key];
    if (!direction) return;
    event.preventDefault();
    play(direction);
  });

  newGameBtn.addEventListener('click', newGame);

  newGame();
})();
