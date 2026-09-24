(function () {
  const { createState, turn, step, tickDelay } = window.SnakeRules;

  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restart');
  const pauseBtn = document.getElementById('pause');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const BEST_KEY = 'games-snake-best';

  const COLS = 20;
  const ROWS = 20;

  const KEYS = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };

  let state;
  let phase = 'ready';
  let timer = null;
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

  function updateScore() {
    scoreEl.textContent = String(state.score);
    bestEl.textContent = String(best);
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const size = Math.round(canvas.clientWidth * ratio) || 400;
    canvas.width = size;
    canvas.height = size;
    draw();
  }

  function draw() {
    if (!state) return;
    const cell = canvas.width / COLS;
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (state.food) {
      ctx.fillStyle = '#f85149';
      ctx.beginPath();
      ctx.arc((state.food.x + 0.5) * cell, (state.food.y + 0.5) * cell, cell * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }
    state.snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? '#7ee787' : '#3fb950';
      ctx.fillRect(part.x * cell + 1, part.y * cell + 1, cell - 2, cell - 2);
    });
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function tick() {
    state = step(state);
    if (state.score > best) {
      best = state.score;
      saveBest(best);
    }
    updateScore();
    draw();
    if (state.over) {
      finish();
      return;
    }
    timer = setTimeout(tick, tickDelay(state.score));
  }

  function finish() {
    phase = 'over';
    clearTimeout(timer);
    updatePause();
    if (state.won) {
      announce('You filled the board. Final score ' + state.score + '. Press Enter to play again.');
    } else {
      announce('Game over. You scored ' + state.score + '. Press Enter to play again.');
    }
  }

  function reset() {
    clearTimeout(timer);
    state = createState({ cols: COLS, rows: ROWS });
    phase = 'ready';
    announce('Press an arrow key to start.');
    updatePause();
    updateScore();
    draw();
  }

  function start() {
    phase = 'running';
    announce('');
    updatePause();
    timer = setTimeout(tick, tickDelay(state.score));
  }

  function updatePause() {
    pauseBtn.disabled = phase !== 'running' && phase !== 'paused';
    pauseBtn.setAttribute('aria-pressed', String(phase === 'paused'));
    pauseBtn.textContent = phase === 'paused' ? 'Resume' : 'Pause';
  }

  function pause() {
    if (phase !== 'running') return;
    clearTimeout(timer);
    phase = 'paused';
    announce('Paused. Press Space or P to carry on.');
    updatePause();
  }

  function resume() {
    if (phase !== 'paused') return;
    start();
  }

  function togglePause() {
    if (phase === 'running') pause();
    else if (phase === 'paused') resume();
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' && phase === 'over') {
      event.preventDefault();
      reset();
      return;
    }
    if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
      if (event.key === ' ' && event.target.closest && event.target.closest('button')) return;
      event.preventDefault();
      togglePause();
      return;
    }
    const dir = KEYS[event.key] || KEYS[event.key.toLowerCase()];
    if (!dir) return;
    event.preventDefault();
    if (phase === 'over' || phase === 'paused') return;
    state = turn(state, dir);
    if (phase === 'ready') start();
  });

  restartBtn.addEventListener('click', () => {
    reset();
    canvas.focus();
  });

  pauseBtn.addEventListener('click', togglePause);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });

  window.addEventListener('resize', resize);

  reset();
  resize();
})();
