(function () {
  const { move, addRandomTile, startGrid } = window.Rules2048;

  const boardEl = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game');

  const KEYS = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down'
  };

  let grid;

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
  }

  function play(direction) {
    const result = move(grid, direction);
    if (!result.moved) return;
    grid = addRandomTile(result.grid);
    render();
  }

  function newGame() {
    grid = startGrid();
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
