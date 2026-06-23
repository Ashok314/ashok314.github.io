(() => {
  const game = document.getElementById('pi_snake');
  if (!game) return;

  const canvas = document.getElementById('pi_snake-board');
  const context = canvas.getContext('2d');
  const scoreElement = document.getElementById('pi_snake-score');
  const bestElement = document.getElementById('pi_snake-best');
  const overlay = document.getElementById('pi_snake-overlay');
  const overlayTitle = document.getElementById('pi_snake-overlay-title');
  const overlayText = document.getElementById('pi_snake-overlay-text');
  const startButton = document.getElementById('pi_snake-start');
  const pauseButton = document.getElementById('pi_snake-pause');
  const shareResultButton = document.getElementById('pi_snake-share-result');
  const shareX = document.getElementById('pi_snake-share-x');
  const achievements = document.getElementById('pi_snake-achievements');
  const achievementsTitle = document.getElementById('pi_snake-achievements-title');
  const achievementItems = Array.from(document.querySelectorAll('[data-achievement]'));
  const gridSize = 18;
  const initialSnake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  const milestones = new Map([
    [16, 'milestone_jpl'],
    [17, 'milestone_double'],
    [38, 'milestone_universe'],
    [314, 'milestone_314']
  ]);

  let digits = null;
  let snake = initialSnake.map((part) => ({ ...part }));
  let direction = directions.right;
  let queuedDirection = directions.right;
  let food = { x: 12, y: 9 };
  let digitIndex = 0;
  let timer = null;
  let milestoneTimer = null;
  let running = false;
  let paused = false;
  let gameOver = false;
  let checkpointActive = false;
  let pointerStart = null;
  let best = 0;
  let shareImagePromise = null;
  try { best = Number(window.localStorage.getItem('pi_snake_best') || 0); } catch (error) {}
  if (!Number.isFinite(best) || best < 0) best = 0;

  const translate = (key) => window.siteUI?.strings?.()?.pi_snake?.[key] || key;
  bestElement.textContent = best;

  const updateShareLink = () => {
    const url = 'https://ashok314.github.io/pi_snake/';
    shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(translate('share_text'))}&url=${encodeURIComponent(url)}`;
  };

  const renderAchievements = () => {
    let unlocked = 0;
    achievementItems.forEach((item) => {
      const achieved = best >= Number(item.dataset.achievement);
      item.hidden = !achieved;
      if (achieved) unlocked += 1;
    });
    achievements.hidden = unlocked === 0;
    achievementsTitle.textContent = translate('achievements');
  };

  renderAchievements();
  updateShareLink();
  window.addEventListener('ui-language-change', renderAchievements);
  window.addEventListener('ui-language-change', updateShareLink);

  const setStatus = (key, achievement = false) => {
    if (!key) {
      overlay.hidden = true;
      return;
    }
    overlay.hidden = false;
    overlay.classList.toggle('achievement', achievement);
    overlay.dataset.state = achievement ? 'achievement' : key;
    overlayTitle.dataset.uiSection = 'pi_snake';
    overlayTitle.dataset.uiKey = achievement ? 'checkpoint' : key;
    overlayTitle.textContent = translate(achievement ? 'checkpoint' : key);
    overlayText.hidden = !achievement;
    if (!achievement) overlayText.textContent = '';
  };

  const colors = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      background: styles.getPropertyValue('--theme-bg').trim() || '#fff',
      snake: styles.getPropertyValue('--theme-text').trim() || '#111',
      grid: styles.getPropertyValue('--theme-border').trim() || '#ddd'
    };
  };

  const draw = () => {
    const size = canvas.width;
    const cell = size / gridSize;
    const palette = colors();
    context.fillStyle = palette.background;
    context.fillRect(0, 0, size, size);

    if (digits) {
      context.fillStyle = palette.snake;
      context.font = `600 ${cell * 0.32}px ui-monospace, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (let index = 0; index < Math.min(digitIndex, gridSize * gridSize); index += 1) {
        context.globalAlpha = 0.25;
        context.fillText(digits[index], ((index % gridSize) + 0.5) * cell, (Math.floor(index / gridSize) + 0.53) * cell);
      }
      context.globalAlpha = 1;
    }

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
    snake.slice(1).forEach((part) => {
      context.beginPath();
      context.arc((part.x + 0.5) * cell, (part.y + 0.5) * cell, cell * 0.37, 0, Math.PI * 2);
      context.fill();
    });

    const head = snake[0];
    const mouthAngle = direction.x > 0 ? 0 : direction.x < 0 ? Math.PI : direction.y > 0 ? Math.PI / 2 : -Math.PI / 2;
    context.fillStyle = '#22c55e';
    context.beginPath();
    context.moveTo((head.x + 0.5) * cell, (head.y + 0.5) * cell);
    context.arc((head.x + 0.5) * cell, (head.y + 0.5) * cell, cell * 0.43, mouthAngle + 0.48, mouthAngle + (Math.PI * 2) - 0.48);
    context.closePath();
    context.fill();

    const foodX = (food.x + 0.5) * cell;
    const foodY = (food.y + 0.5) * cell;
    context.fillStyle = '#22c55e';
    context.beginPath();
    context.moveTo(foodX - (cell * 0.32), foodY - (cell * 0.37));
    context.lineTo(foodX + (cell * 0.42), foodY);
    context.lineTo(foodX - (cell * 0.32), foodY + (cell * 0.37));
    context.closePath();
    context.fill();
    context.fillStyle = '#07110a';
    context.font = `700 ${cell * 0.58}px ui-monospace, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(digits ? digits[digitIndex] : 'π', foodX - (cell * 0.08), foodY + (cell * 0.03));

    canvas.classList.toggle('game-over', gameOver);
  };

  const announceMilestone = () => {
    const key = milestones.get(digitIndex);
    if (!key) return false;
    window.clearTimeout(milestoneTimer);
    canvas.classList.add('milestone');
    setStatus(key, true);
    checkpointActive = true;
    pauseButton.disabled = true;
    overlayText.dataset.uiSection = 'pi_snake';
    overlayText.dataset.uiKey = key;
    overlayText.textContent = translate(key);
    overlay.hidden = false;
    milestoneTimer = window.setTimeout(() => {
      canvas.classList.remove('milestone');
      overlay.hidden = true;
      checkpointActive = false;
      pauseButton.disabled = !running;
      if (running && !paused) step();
    }, digitIndex === 314 ? 3140 : 2200);
    if (navigator.vibrate) navigator.vibrate([18, 35, 18]);
    return true;
  };

  const updateSequence = () => {
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
    canvas.classList.add('game-over');
    pauseButton.disabled = true;
    pauseButton.textContent = translate('pause');
    pauseButton.dataset.uiKey = 'pause';
    startButton.textContent = translate('restart');
    startButton.dataset.uiKey = 'restart';
    startButton.classList.add('restart');
    startButton.hidden = false;
    shareResultButton.hidden = false;
    setStatus(message);
  };

  const createShareImage = () => new Promise((resolve, reject) => {
    const image = document.createElement('canvas');
    image.width = 1200;
    image.height = 1200;
    const imageContext = image.getContext('2d');
    const palette = colors();
    imageContext.fillStyle = palette.background;
    imageContext.fillRect(0, 0, image.width, image.height);
    imageContext.fillStyle = palette.snake;
    imageContext.font = '700 54px ui-monospace, monospace';
    imageContext.textAlign = 'center';
    imageContext.fillText(`pi_snake · ${translate('score')} ${digitIndex}`, 600, 76);
    imageContext.drawImage(canvas, 80, 120, 1040, 1040);
    imageContext.strokeStyle = '#ff0033';
    imageContext.lineWidth = 8;
    imageContext.strokeRect(80, 120, 1040, 1040);
    image.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create screenshot.')), 'image/png');
  });

  const shareResult = async () => {
    const blob = await (shareImagePromise || createShareImage());
    const file = new File([blob], 'pi_snake-score.png', { type: 'image/png' });
    const text = translate('share_score').replace('{score}', digitIndex);
    const url = 'https://ashok314.github.io/pi_snake/';
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, url });
      return;
    }

    const download = document.createElement('a');
    download.href = URL.createObjectURL(blob);
    download.download = file.name;
    download.click();
    window.setTimeout(() => URL.revokeObjectURL(download.href), 1000);
    const composer = document.createElement('a');
    composer.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    composer.target = '_blank';
    composer.rel = 'noopener';
    composer.click();
  };

  const step = () => {
    if (!running || paused) return;
    direction = queuedDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize;
    const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);
    if (hitWall || hitSelf) {
      gameOver = true;
      stop('game_over');
      draw();
      shareImagePromise = createShareImage();
      return;
    }

    snake.unshift(head);
    let milestoneReached = false;
    if (head.x === food.x && head.y === food.y) {
      digitIndex += 1;
      if (digitIndex > best) {
        best = digitIndex;
        bestElement.textContent = best;
        renderAchievements();
        try { window.localStorage.setItem('pi_snake_best', String(best)); } catch (error) {}
      }
      updateSequence();
      milestoneReached = announceMilestone();
      if (!milestoneReached && navigator.vibrate) navigator.vibrate(12);
      placeFood();
    } else {
      snake.pop();
    }

    draw();
    const delay = Math.max(70, 145 - Math.floor(digitIndex / 5) * 4);
    if (!milestoneReached) timer = window.setTimeout(step, delay);
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
      gameOver = false;
      shareImagePromise = null;
      shareResultButton.hidden = true;
      canvas.classList.remove('game-over');
      checkpointActive = false;
      window.clearTimeout(milestoneTimer);
      canvas.classList.remove('milestone');
      overlay.hidden = true;
      placeFood();
      updateSequence();
      setStatus(null);
      pauseButton.disabled = false;
      pauseButton.textContent = translate('pause');
      pauseButton.dataset.uiKey = 'pause';
      startButton.textContent = translate('restart');
      startButton.dataset.uiKey = 'restart';
      startButton.classList.remove('restart');
      startButton.hidden = true;
      canvas.focus();
      draw();
      timer = window.setTimeout(step, 300);
    } catch (error) {
      overlay.hidden = false;
      overlay.classList.remove('achievement');
      overlay.dataset.state = 'error';
      overlayTitle.removeAttribute('data-ui-section');
      overlayTitle.removeAttribute('data-ui-key');
      overlayTitle.textContent = error.message;
      overlayText.hidden = true;
    } finally {
      startButton.disabled = false;
    }
  };

  const togglePause = () => {
    if (!running || checkpointActive) return;
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
    if (event.target instanceof HTMLButtonElement && event.code === 'Space') return;
    if ((event.code === 'Space' || event.key === 'p' || event.key === 'P') && running) {
      event.preventDefault();
      togglePause();
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      start();
      return;
    }
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

  canvas.addEventListener('pointercancel', () => { pointerStart = null; });

  document.querySelectorAll('[data-direction]').forEach((button) => {
    button.addEventListener('click', () => setDirection(directions[button.dataset.direction]));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !paused) togglePause();
  });

  startButton.addEventListener('click', start);
  pauseButton.addEventListener('click', togglePause);
  shareResultButton.addEventListener('click', () => {
    shareResult().catch((error) => {
      if (error.name !== 'AbortError') setStatus('share_failed');
    });
  });
  window.addEventListener('resize', draw);
  loadDigits().then(draw).catch(draw);
  draw();
})();
