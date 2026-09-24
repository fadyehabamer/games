(function () {
  const { emptyBoard, winner, isFull, play, nextPlayer, other, bestMove } = window.TicTacToe;

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const newRoundBtn = document.getElementById('new-round');
  const sideOptions = document.getElementById('side-options');

  const AI_DELAY = 300;

  let board = emptyBoard();
  let finished = false;
  let thinking = false;
  let aiTimer = null;
  const cells = [];

  function mode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function humanSide() {
    return document.querySelector('input[name="side"]:checked').value;
  }

  function computerSide() {
    return mode() === 'ai' ? other(humanSide()) : null;
  }

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
      btn.setAttribute('aria-disabled', String(finished || thinking || board[i] !== null));
    });
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function resultMessage(player) {
    const computer = computerSide();
    if (!computer) return player + ' wins.';
    return player === computer ? 'The computer wins.' : 'You win!';
  }

  function afterMove() {
    const win = winner(board);
    const computer = computerSide();
    if (win) {
      finished = true;
      announce(resultMessage(win.player));
    } else if (isFull(board)) {
      finished = true;
      announce('Draw.');
    } else if (computer && nextPlayer(board) === computer) {
      thinking = true;
      announce('Computer is thinking\u2026');
      aiTimer = setTimeout(computerTurn, AI_DELAY);
    } else if (computer) {
      announce('Your move, you are ' + humanSide() + '.');
    } else {
      announce(nextPlayer(board) + ' to move.');
    }
    render();
  }

  function computerTurn() {
    aiTimer = null;
    thinking = false;
    const move = bestMove(board, computerSide());
    if (move === null) return;
    board = play(board, move, computerSide());
    afterMove();
  }

  function onCell(i) {
    if (finished || thinking || board[i] !== null) return;
    board = play(board, i, nextPlayer(board));
    afterMove();
  }

  function newRound() {
    clearTimeout(aiTimer);
    aiTimer = null;
    thinking = false;
    board = emptyBoard();
    finished = false;
    sideOptions.disabled = mode() !== 'ai';
    afterMove();
  }

  newRoundBtn.addEventListener('click', newRound);
  document.querySelectorAll('input[name="mode"], input[name="side"]').forEach((input) => {
    input.addEventListener('change', newRound);
  });

  build();
  newRound();
})();
