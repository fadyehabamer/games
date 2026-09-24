(function () {
  const { emptyBoard, winner, isFull, play, nextPlayer } = window.TicTacToe;

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const newRoundBtn = document.getElementById('new-round');

  let board = emptyBoard();
  let finished = false;
  const cells = [];

  function cellLabel(i) {
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    return 'Row ' + row + ', column ' + col + ', ' + (board[i] || 'empty');
  }

  function build() {
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cell';
      btn.dataset.index = String(i);
      btn.addEventListener('click', () => onCell(i));
      boardEl.appendChild(btn);
      cells.push(btn);
    }
  }

  function render() {
    cells.forEach((btn, i) => {
      btn.textContent = board[i] || '';
      btn.classList.toggle('x', board[i] === 'X');
      btn.classList.toggle('o', board[i] === 'O');
      btn.setAttribute('aria-label', cellLabel(i));
      btn.setAttribute('aria-disabled', String(finished || board[i] !== null));
    });
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function afterMove() {
    const win = winner(board);
    if (win) {
      finished = true;
      announce(win.player + ' wins.');
    } else if (isFull(board)) {
      finished = true;
      announce('Draw.');
    } else {
      announce(nextPlayer(board) + ' to move.');
    }
    render();
  }

  function onCell(i) {
    if (finished || board[i] !== null) return;
    board = play(board, i, nextPlayer(board));
    afterMove();
  }

  function newRound() {
    board = emptyBoard();
    finished = false;
    afterMove();
  }

  newRoundBtn.addEventListener('click', newRound);

  build();
  newRound();
})();
