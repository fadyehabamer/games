(function () {
  const { createState, turn, step } = window.SnakeRules;

  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restart');

  const COLS = 20;
  const ROWS = 20;
  const TICK = 140;

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
    draw();
    if (state.over) {
      finish();
      return;
    }
    timer = setTimeout(tick, TICK);
  }

  function finish() {
    phase = 'over';
    clearTimeout(timer);
    announce('Game over. You scored ' + state.score + '. Press Enter to play again.');
  }

  function reset() {
    clearTimeout(timer);
    state = createState({ cols: COLS, rows: ROWS });
    phase = 'ready';
    announce('Press an arrow key to start.');
    draw();
  }

  function start() {
    phase = 'running';
    announce('');
    timer = setTimeout(tick, TICK);
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' && phase === 'over') {
      event.preventDefault();
      reset();
      return;
    }
    const dir = KEYS[event.key] || KEYS[event.key.toLowerCase()];
    if (!dir) return;
    event.preventDefault();
    if (phase === 'over') return;
    state = turn(state, dir);
    if (phase === 'ready') start();
  });

  restartBtn.addEventListener('click', () => {
    reset();
    canvas.focus();
  });

  window.addEventListener('resize', resize);

  reset();
  resize();
})();
