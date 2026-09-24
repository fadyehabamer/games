(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.TicTacToe = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function emptyBoard() {
    return Array(9).fill(null);
  }

  function other(player) {
    return player === 'X' ? 'O' : 'X';
  }

  function winner(board) {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line };
      }
    }
    return null;
  }

  function availableMoves(board) {
    const moves = [];
    board.forEach((cell, i) => {
      if (cell === null) moves.push(i);
    });
    return moves;
  }

  function isFull(board) {
    return board.every((cell) => cell !== null);
  }

  function play(board, index, player) {
    if (board[index] !== null) throw new Error('Cell ' + index + ' is taken');
    const next = board.slice();
    next[index] = player;
    return next;
  }

  function nextPlayer(board) {
    const x = board.filter((c) => c === 'X').length;
    const o = board.filter((c) => c === 'O').length;
    return x > o ? 'O' : 'X';
  }

  function minimax(board, toMove, ai, depth, alpha, beta) {
    const win = winner(board);
    if (win) return win.player === ai ? 10 - depth : depth - 10;
    if (isFull(board)) return 0;
    const moves = availableMoves(board);
    if (toMove === ai) {
      let best = -Infinity;
      for (const i of moves) {
        best = Math.max(best, minimax(play(board, i, toMove), other(toMove), ai, depth + 1, alpha, beta));
        alpha = Math.max(alpha, best);
        if (alpha >= beta) break;
      }
      return best;
    }
    let best = Infinity;
    for (const i of moves) {
      best = Math.min(best, minimax(play(board, i, toMove), other(toMove), ai, depth + 1, alpha, beta));
      beta = Math.min(beta, best);
      if (alpha >= beta) break;
    }
    return best;
  }

  function bestMove(board, ai) {
    let bestScore = -Infinity;
    let move = null;
    for (const i of availableMoves(board)) {
      const score = minimax(play(board, i, ai), other(ai), ai, 1, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
    return move;
  }

  return { minimax, bestMove, LINES, emptyBoard, other, winner, availableMoves, isFull, play, nextPlayer };
});
