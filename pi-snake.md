---
layout: home
title: Pi Snake
permalink: /pi-snake/
ui_page: pi_snake
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="pi_snake_tagline">{{ ui.pages.pi_snake_tagline }}</p>

<div id="pi-snake" class="pi-snake" data-digits-url="{{ '/assets/pi-digits.txt' | relative_url }}">
  <div class="pi-snake-meta">
    <span><span data-ui-section="pi_snake" data-ui-key="score">{{ ui.pi_snake.score }}</span> <strong id="pi-snake-score">0</strong></span>
    <span><span data-ui-section="pi_snake" data-ui-key="best">{{ ui.pi_snake.best }}</span> <strong id="pi-snake-best">0</strong></span>
  </div>

  <canvas id="pi-snake-board" width="640" height="640" tabindex="0" aria-label="Pi Snake game board"></canvas>

  <p class="pi-snake-sequence"><span data-ui-section="pi_snake" data-ui-key="sequence">{{ ui.pi_snake.sequence }}</span> <code id="pi-snake-sequence">—</code></p>
  <p id="pi-snake-status" class="pi-snake-status" role="status" aria-live="polite" data-ui-section="pi_snake" data-ui-key="ready">{{ ui.pi_snake.ready }}</p>

  <div class="pi-snake-actions">
    <button id="pi-snake-start" type="button" data-ui-section="pi_snake" data-ui-key="start">{{ ui.pi_snake.start }}</button>
    <button id="pi-snake-pause" type="button" disabled data-ui-section="pi_snake" data-ui-key="pause">{{ ui.pi_snake.pause }}</button>
  </div>

  <div class="pi-snake-pad" aria-label="Snake controls">
    <button type="button" data-direction="up" aria-label="{{ ui.pi_snake.up }}" data-ui-aria-section="pi_snake" data-ui-aria-key="up">↑</button>
    <button type="button" data-direction="left" aria-label="{{ ui.pi_snake.left }}" data-ui-aria-section="pi_snake" data-ui-aria-key="left">←</button>
    <button type="button" data-direction="down" aria-label="{{ ui.pi_snake.down }}" data-ui-aria-section="pi_snake" data-ui-aria-key="down">↓</button>
    <button type="button" data-direction="right" aria-label="{{ ui.pi_snake.right }}" data-ui-aria-section="pi_snake" data-ui-aria-key="right">→</button>
  </div>
</div>

<style>
  .pi-snake { max-width: 38rem; margin: 1.5rem auto 0; padding: 1rem; border: 1px solid var(--theme-border); border-radius: 0.75rem; background: var(--theme-surface); }
  .pi-snake-meta { display: flex; justify-content: space-between; margin-bottom: 0.65rem; }
  #pi-snake-board { display: block; width: 100%; height: auto; aspect-ratio: 1; border: 1px solid var(--theme-border); border-radius: 0.5rem; background: var(--theme-bg); touch-action: none; }
  .pi-snake-sequence { min-height: 1.6rem; margin: 0.75rem 0 0.25rem; overflow-wrap: anywhere; }
  .pi-snake-status { min-height: 1.4rem; margin: 0.25rem 0; color: var(--theme-muted); }
  .pi-snake-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
  .pi-snake button { padding: 0.55rem 0.9rem; border: 1px solid var(--theme-border); border-radius: 0.4rem; background: var(--theme-bg); color: var(--theme-text); cursor: pointer; font: inherit; }
  .pi-snake button:disabled { cursor: default; opacity: 0.45; }
  #pi-snake-start { background: var(--theme-link); color: var(--theme-bg); }
  .pi-snake-pad { display: grid; grid-template-columns: repeat(3, 3.25rem); grid-template-rows: repeat(2, 3.25rem); justify-content: center; gap: 0.35rem; margin-top: 1rem; }
  .pi-snake-pad button { width: 3.25rem; height: 3.25rem; padding: 0; font-size: 1.25rem; touch-action: manipulation; }
  .pi-snake-pad [data-direction="up"] { grid-column: 2; }
  .pi-snake-pad [data-direction="left"] { grid-column: 1; grid-row: 2; }
  .pi-snake-pad [data-direction="down"] { grid-column: 2; grid-row: 2; }
  .pi-snake-pad [data-direction="right"] { grid-column: 3; grid-row: 2; }
  @media (pointer: fine) { .pi-snake-pad { display: none; } }
</style>

<script src="{{ '/assets/js/pi-snake.js' | relative_url }}" defer></script>
