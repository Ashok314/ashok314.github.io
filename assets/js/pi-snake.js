(() => {
  const game = document.getElementById('pi-snake');
  if (!game) return;

  const canvas = document.getElementById('pi-snake-board');
  const context = canvas.getContext('2d');
  const scoreElement = document.getElementById('pi-snake-score');
  const bestElement = document.getElementById('pi-snake-best');
  const sequenceElement = document.getElementById('pi-snake-sequence');
  const statusElement = document.getElementById('pi-snake-status');
  const startButton = document.getElementById('pi-snake-start');
  const pauseButton = document.getElementById('pi-snake-pause');
  const gridSize = 18;
  const initialSnake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  let digits = null;
  let snake = initialSnake.map((part) => ({ ...part }));
  let direction = directions.right;
  let queuedDirection = directions.right;
  let food = { x: 12, y: 9 };
  let digitIndex = 0;
  let timer = null;
  let running = false;
  let paused = false;
  let pointerStart = null;
  let best = Number(window.localStorage.getItem('pi_snake_best') || 0);

  const translate = (key) => window.siteUI?.strings?.()?.pi_snake?.[key] || key;
  bestElement.textContent = best;

  const setStatus = (key) => {
    if (!key) {
      statusElement.removeAttribute('data-ui-section');
      statusElement.removeAttribute('data-ui-key');
      statusElement.textContent = '';
      return;
    }
    statusElement.dataset.uiSection = 'pi_snake';
    statusElement.dataset.uiKey = key;
    statusElement.textContent = translate(key);
  };

  const colors = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      background: styles.getPropertyValue('--theme-bg').trim() || '#fff',
      snake: styles.getPropertyValue('--theme-text').trim() || '#111',
      food: styles.getPropertyValue('--theme-link').trim() || '#2a7ae2',
      grid: styles.getPropertyValue('--theme-border').trim() || '#ddd'
    };
  };

  const draw = () => {
    const size = canvas.width;
    const cell = size / gridSize;
    const palette = colors();
    context.fillStyle = palette.background;
    context.fillRect(0, 0, size, size);

    context.strokeStyle = palette.grid;
    context.globalAlpha = 0.18;
    context.lineWidth = 1;
    for (let index = 1; index < gridSize; index += 1) {
      const point = index * cell;
      context.beginPath();
      context.moveTo(point, 0);
      context.lineTo(point, size);
      context.moveTo(0, point);
      context.lineTo(size, point);
      context.stroke();
    }
    context.globalAlpha = 1;

    context.fillStyle = palette.snake;
    snake.forEach((part, index) => {
      const inset = index === 0 ? cell * 0.08 : cell * 0.13;
      context.fillRect((part.x * cell) + inset, (part.y * cell) + inset, cell - (inset * 2), cell - (inset * 2));
    });

    context.fillStyle = palette.food;
    context.beginPath();
    context.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, cell * 0.43, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = palette.background;
    context.font = `700 ${cell * 0.58}px ui-monospace, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(digits ? digits[digitIndex] : 'π', (food.x + 0.5) * cell, (food.y + 0.53) * cell);
  };

  const updateSequence = () => {
    const consumed = digits ? digits.slice(0, digitIndex) : '3';
    const formatted = consumed.length > 1 ? `${consumed[0]}.${consumed.slice(1)}` : consumed ? `${consumed}.` : '—';
    sequenceElement.textContent = formatted.length > 48 ? `…${formatted.slice(-47)}` : formatted;
    scoreElement.textContent = digitIndex;
  };

  const placeFood = () => {
    const empty = [];
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        if (!snake.some((part) => part.x === x && part.y === y)) empty.push({ x, y });
      }
    }
    food = empty[Math.floor(Math.random() * empty.length)] || food;
  };

  const setDirection = (next) => {
    if (!next) return;
    if (next.x + direction.x === 0 && next.y + direction.y === 0) return;
    queuedDirection = next;
  };

  const stop = (message) => {
    window.clearTimeout(timer);
    timer = null;
    running = false;
    paused = false;
    pauseButton.disabled = true;
    pauseButton.textContent = translate('pause');
    pauseButton.dataset.uiKey = 'pause';
    startButton.textContent = translate('restart');
    startButton.dataset.uiKey = 'restart';
    setStatus(message);
  };

  const step = () => {
    if (!running || paused) return;
    direction = queuedDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize;
    const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);
    if (hitWall || hitSelf) {
      stop('game_over');
      draw();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      digitIndex += 1;
      if (digitIndex > best) {
        best = digitIndex;
        bestElement.textContent = best;
        try { window.localStorage.setItem('pi_snake_best', String(best)); } catch (error) {}
      }
      if (navigator.vibrate) navigator.vibrate(12);
      updateSequence();
      placeFood();
    } else {
      snake.pop();
    }

    draw();
    const delay = Math.max(70, 145 - Math.floor(digitIndex / 5) * 4);
    timer = window.setTimeout(step, delay);
  };

  const loadDigits = async () => {
    if (digits) return;
    const response = await fetch(game.dataset.digitsUrl);
    if (!response.ok) throw new Error('Could not load pi digits.');
    digits = (await response.text()).replace(/\D/g, '');
  };

  const start = async () => {
    startButton.disabled = true;
    try {
      await loadDigits();
      window.clearTimeout(timer);
      snake = initialSnake.map((part) => ({ ...part }));
      direction = directions.right;
      queuedDirection = directions.right;
      digitIndex = 0;
      running = true;
      paused = false;
      placeFood();
      updateSequence();
      setStatus(null);
      pauseButton.disabled = false;
      pauseButton.textContent = translate('pause');
      pauseButton.dataset.uiKey = 'pause';
      startButton.textContent = translate('restart');
      startButton.dataset.uiKey = 'restart';
      canvas.focus();
      draw();
      timer = window.setTimeout(step, 300);
    } catch (error) {
      statusElement.textContent = error.message;
    } finally {
      startButton.disabled = false;
    }
  };

  const togglePause = () => {
    if (!running) return;
    paused = !paused;
    window.clearTimeout(timer);
    timer = null;
    pauseButton.textContent = translate(paused ? 'resume' : 'pause');
    pauseButton.dataset.uiKey = paused ? 'resume' : 'pause';
    setStatus(paused ? 'paused' : null);
    if (!paused) step();
  };

  const keyboardDirection = {
    ArrowUp: directions.up, w: directions.up, W: directions.up,
    ArrowDown: directions.down, s: directions.down, S: directions.down,
    ArrowLeft: directions.left, a: directions.left, A: directions.left,
    ArrowRight: directions.right, d: directions.right, D: directions.right
  };

  window.addEventListener('keydown', (event) => {
    const next = keyboardDirection[event.key];
    if (!next || !running) return;
    event.preventDefault();
    setDirection(next);
  });

  canvas.addEventListener('pointerdown', (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const x = event.clientX - pointerStart.x;
    const y = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.max(Math.abs(x), Math.abs(y)) < 18) return;
    setDirection(Math.abs(x) > Math.abs(y) ? (x > 0 ? directions.right : directions.left) : (y > 0 ? directions.down : directions.up));
  });

  document.querySelectorAll('[data-direction]').forEach((button) => {
    button.addEventListener('click', () => setDirection(directions[button.dataset.direction]));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !paused) togglePause();
  });

  startButton.addEventListener('click', start);
  pauseButton.addEventListener('click', togglePause);
  window.addEventListener('resize', draw);
  draw();
})();
