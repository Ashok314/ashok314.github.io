(() => {
  const tool = document.getElementById('pi-portrait-tool');
  if (!tool) return;

  const imageInput = document.getElementById('pi-image');
  const useSample = document.getElementById('pi-use-sample');
  const fileName = document.getElementById('pi-file-name');
  const framing = document.getElementById('pi-framing');
  const horizontal = document.getElementById('pi-x');
  const vertical = document.getElementById('pi-y');
  const zoom = document.getElementById('pi-zoom');
  const detail = document.getElementById('pi-detail');
  const color = document.getElementById('pi-color');
  const customColors = document.getElementById('pi-custom-colors');
  const backgroundColor = document.getElementById('pi-background-color');
  const digitColor = document.getElementById('pi-digit-color');
  const generate = document.getElementById('pi-generate');
  const downloadSvg = document.getElementById('pi-download-svg');
  const downloadPng = document.getElementById('pi-download-png');
  const status = document.getElementById('pi-status');
  const result = document.getElementById('pi-result');
  const crop = document.getElementById('pi-crop');
  const cropContext = crop.getContext('2d');
  const sourceImage = new Image();
  const palettes = {
    normal: { background: '#f7f2e8', digits: '#10261a' },
    blackwhite: { background: '#ffffff', digits: '#000000' },
    neo: { background: '#f7f2e8', digits: '#d0009f' },
    matrix: { background: '#f7f2e8', digits: '#007a36' }
  };

  let sourceUrl = null;
  let resultUrl = null;
  let pngUrl = null;
  let piDigits = null;

  const translate = (key) => window.siteUI?.strings?.()?.pi_tool?.[key] || key;

  const frame = (context, size) => {
    const scale = Number(zoom.value) / 100;
    const cropSize = Math.min(sourceImage.naturalWidth, sourceImage.naturalHeight) / scale;
    const x = (sourceImage.naturalWidth - cropSize) * (Number(horizontal.value) / 100);
    const y = (sourceImage.naturalHeight - cropSize) * (Number(vertical.value) / 100);
    context.clearRect(0, 0, size, size);
    context.drawImage(sourceImage, x, y, cropSize, cropSize, 0, 0, size, size);
  };

  const previewFrame = () => {
    if (!sourceImage.naturalWidth) return;
    frame(cropContext, crop.width);
    downloadSvg.hidden = true;
    downloadPng.hidden = true;
    result.hidden = true;
    status.textContent = '';
  };

  const loadDigits = async () => {
    if (piDigits) return piDigits;
    const response = await fetch(tool.dataset.digitsUrl);
    if (!response.ok) throw new Error('Could not load pi digits.');
    piDigits = (await response.text()).replace(/\D/g, '');
    return piDigits;
  };

  const portraitMask = (x, y, size) => {
    const nx = x / (size - 1);
    const ny = y / (size - 1);
    const head = Math.hypot((nx - 0.51) / 0.34, (ny - 0.39) / 0.39);
    const torso = Math.hypot((nx - 0.50) / 0.62, (ny - 1.02) / 0.53);
    const edge = Math.max(1 - head, 1 - torso);
    return Math.min(Math.max(edge / 0.08, 0), 1);
  };

  const makeSvg = async () => {
    const count = Number(detail.value);
    const digits = await loadDigits();
    if (digits.length < count) throw new Error('Not enough pi digits are available.');

    const size = Math.ceil(Math.sqrt(count));
    const total = size * size;
    const cell = 10;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    frame(context, size);
    const rgba = context.getImageData(0, 0, size, size).data;
    const grays = new Float32Array(total);

    for (let index = 0; index < total; index += 1) {
      const offset = index * 4;
      const gray = (rgba[offset] * 0.2126) + (rgba[offset + 1] * 0.7152) + (rgba[offset + 2] * 0.0722);
      const x = index % size;
      const y = Math.floor(index / size);
      const mask = portraitMask(x, y, size);
      grays[index] = 255 - ((255 - gray) * mask);
    }

    const omitCount = total - count;
    const indices = Array.from({ length: total }, (_, index) => index);
    indices.sort((left, right) => grays[right] - grays[left] || left - right);
    const omitted = new Set(indices.slice(0, omitCount));
    const cells = new Array(total).fill(' ');
    let digitIndex = 0;

    for (let index = 0; index < total; index += 1) {
      if (omitted.has(index)) continue;
      cells[index] = digits[digitIndex];
      digitIndex += 1;
    }

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = size;
    maskCanvas.height = size;
    const maskContext = maskCanvas.getContext('2d');
    const maskImage = maskContext.createImageData(size, size);
    for (let index = 0; index < total; index += 1) {
      const darkness = 1 - (grays[index] / 255);
      const opacity = 0.015 + (darkness ** 0.55 * 0.985);
      const offset = index * 4;
      maskImage.data[offset] = 255;
      maskImage.data[offset + 1] = 255;
      maskImage.data[offset + 2] = 255;
      maskImage.data[offset + 3] = Math.round(opacity * 255);
    }
    maskContext.putImageData(maskImage, 0, 0);
    const maskData = maskCanvas.toDataURL('image/png');

    const rows = [];
    for (let y = 0; y < size; y += 1) {
      const row = cells.slice(y * size, (y + 1) * size).join('');
      rows.push(`<text x="0" y="${(y * cell) + (cell * 0.82)}">${row}</text>`);
    }

    const palette = color.value === 'custom'
      ? { background: backgroundColor.value, digits: digitColor.value }
      : palettes[color.value] || palettes.normal;
    const extent = size * cell;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${extent} ${extent}" role="img" aria-labelledby="title description" data-pi-digits="${count}"><title id="title">Portrait made from digits of pi</title><desc id="description">A typographic portrait composed of exactly the first ${count} numerical digits of pi.</desc><style>text{fill:${palette.digits};font-family:Menlo,Monaco,monospace;font-size:9.7px;font-weight:600;letter-spacing:4.16px;white-space:pre}</style><rect width="100%" height="100%" fill="${palette.background}"/><defs><mask id="portrait-mask" mask-type="alpha"><image href="${maskData}" width="${extent}" height="${extent}" preserveAspectRatio="none" image-rendering="pixelated"/></mask></defs><g data-pi-portrait="true" mask="url(#portrait-mask)" xml:space="preserve">${rows.join('')}</g></svg>`;
    return { svg, extent };
  };

  const rasterize = (url, extent) => new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = extent;
      canvas.height = extent;
      canvas.getContext('2d').drawImage(image, 0, 0, extent, extent);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create PNG.')), 'image/png');
    });
    image.addEventListener('error', () => reject(new Error('Could not render PNG.')));
    image.src = url;
  });

  imageInput.addEventListener('change', () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    fileName.removeAttribute('data-ui-section');
    fileName.removeAttribute('data-ui-key');
    fileName.textContent = file.name;
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = URL.createObjectURL(file);
    sourceImage.src = sourceUrl;
  });

  useSample.addEventListener('click', () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = null;
    imageInput.value = '';
    fileName.dataset.uiSection = 'pi_tool';
    fileName.dataset.uiKey = 'sample';
    fileName.textContent = translate('sample');
    sourceImage.src = tool.dataset.sampleUrl;
  });

  sourceImage.addEventListener('load', () => {
    framing.disabled = false;
    generate.disabled = false;
    previewFrame();
  });

  sourceImage.addEventListener('error', () => {
    status.textContent = 'Could not read this image.';
  });

  [horizontal, vertical, zoom].forEach((input) => input.addEventListener('input', previewFrame));

  color.addEventListener('change', () => {
    customColors.hidden = color.value !== 'custom';
  });

  generate.addEventListener('click', async () => {
    generate.disabled = true;
    downloadSvg.hidden = true;
    downloadPng.hidden = true;
    result.hidden = true;
    const count = Number(detail.value).toLocaleString();
    status.textContent = translate('generating').replace('{count}', count);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    try {
      const { svg, extent } = await makeSvg();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      result.src = resultUrl;
      result.hidden = false;
      downloadSvg.href = resultUrl;
      downloadSvg.hidden = false;

      const png = await rasterize(resultUrl, extent);
      if (pngUrl) URL.revokeObjectURL(pngUrl);
      pngUrl = URL.createObjectURL(png);
      downloadPng.href = pngUrl;
      downloadPng.hidden = false;
      status.textContent = translate('ready');
    } catch (error) {
      status.textContent = error.message || 'Could not generate the portrait.';
    } finally {
      generate.disabled = false;
    }
  });
})();
