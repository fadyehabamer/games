(function () {
  const { emptyBoard, winner, isFull, play, nextPlayer, other, computerMove } = window.TicTacToe;

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const newRoundBtn = document.getElementById('new-round');
  const sideOptions = document.getElementById('side-options');
  const levelOptions = document.getElementById('level-options');

  const scoreEls = {
    X: document.getElementById('score-x'),
    O: document.getElementById('score-o'),
    draw: document.getElementById('score-draw')
  };
  const labelX = document.getElementById('label-x');
  const labelO = document.getElementById('label-o');

  const AI_DELAY = 300;

  let board = emptyBoard();
  let finished = false;
  let thinking = false;
  let aiTimer = null;
  let winLine = [];
  let scores = { X: 0, O: 0, draw: 0 };
  const cells = [];

  function mode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function humanSide() {
    return document.querySelector('input[name="side"]:checked').value;
  }

  function level() {
    return document.querySelector('input[name="level"]:checked').value;
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
      btn.classList.toggle('win', winLine.includes(i));
      btn.setAttribute('aria-label', cellLabel(i));
      btn.setAttribute('aria-disabled', String(finished || thinking || board[i] !== null));
    });
  }

  function renderScores() {
    const computer = computerSide();
    labelX.textContent = computer ? (computer === 'X' ? 'Computer (X)' : 'You (X)') : 'X';
    labelO.textContent = computer ? (computer === 'O' ? 'Computer (O)' : 'You (O)') : 'O';
    scoreEls.X.textContent = String(scores.X);
    scoreEls.O.textContent = String(scores.O);
    scoreEls.draw.textContent = String(scores.draw);
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
      winLine = win.line;
      scores[win.player] += 1;
      announce(resultMessage(win.player));
    } else if (isFull(board)) {
      finished = true;
      scores.draw += 1;
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
    renderScores();
  }

  function computerTurn() {
    aiTimer = null;
    thinking = false;
    const move = computerMove(board, computerSide(), level());
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
    winLine = [];
    sideOptions.disabled = mode() !== 'ai';
    levelOptions.disabled = mode() !== 'ai';
    afterMove();
  }

  newRoundBtn.addEventListener('click', newRound);
  document.querySelectorAll('input[name="mode"], input[name="side"], input[name="level"]').forEach((input) => {
    input.addEventListener('change', () => {
      scores = { X: 0, O: 0, draw: 0 };
      newRound();
    });
  });

  build();
  newRound();
})();
