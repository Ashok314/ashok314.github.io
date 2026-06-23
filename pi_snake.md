---
layout: home
title: pi_snake
permalink: /pi_snake/
ui_page: pi_snake
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="pi_snake_tagline">{{ ui.pages.pi_snake_tagline }}</p>

<div id="pi_snake" class="pi_snake" data-digits-url="{{ '/assets/pi-digits.txt' | relative_url }}">
  <div class="pi_snake-meta">
    <span><span data-ui-section="pi_snake" data-ui-key="score">{{ ui.pi_snake.score }}</span> <strong id="pi_snake-score">0</strong></span>
    <span><span data-ui-section="pi_snake" data-ui-key="best">{{ ui.pi_snake.best }}</span> <strong id="pi_snake-best">0</strong></span>
  </div>

  <div class="pi_snake-screen">
    <canvas id="pi_snake-board" width="640" height="640" tabindex="0" aria-label="pi_snake game board"></canvas>
    <div id="pi_snake-overlay" class="pi_snake-overlay" hidden role="status" aria-live="polite">
      <strong id="pi_snake-overlay-title"></strong>
      <span id="pi_snake-overlay-text" hidden></span>
    </div>
    <button id="pi_snake-start" class="pi_snake-start-overlay" type="button" data-ui-section="pi_snake" data-ui-key="start">{{ ui.pi_snake.start }}</button>
  </div>

  <div class="pi_snake-actions">
    <button id="pi_snake-pause" type="button" disabled data-ui-section="pi_snake" data-ui-key="pause">{{ ui.pi_snake.pause }}</button>
    <button id="pi_snake-share-result" type="button" hidden data-ui-section="pi_snake" data-ui-key="share_result">{{ ui.pi_snake.share_result }}</button>
  </div>
  <p class="pi_snake-shortcuts" data-ui-section="pi_snake" data-ui-key="shortcuts">{{ ui.pi_snake.shortcuts }}</p>

  <div id="pi_snake-achievements" class="pi_snake-achievements" hidden>
    <strong id="pi_snake-achievements-title">{{ ui.pi_snake.achievements }}</strong>
    <ul>
      <li data-achievement="16" hidden><span class="pi-achievement-mark" aria-hidden="true">✓</span><span data-ui-section="pi_snake" data-ui-key="milestone_jpl">{{ ui.pi_snake.milestone_jpl }}</span></li>
      <li data-achievement="17" hidden><span class="pi-achievement-mark" aria-hidden="true">✓</span><span data-ui-section="pi_snake" data-ui-key="milestone_double">{{ ui.pi_snake.milestone_double }}</span></li>
      <li data-achievement="38" hidden><span class="pi-achievement-mark" aria-hidden="true">✓</span><span data-ui-section="pi_snake" data-ui-key="milestone_universe">{{ ui.pi_snake.milestone_universe }}</span></li>
      <li data-achievement="314" hidden><span class="pi-achievement-mark" aria-hidden="true">✓</span><span data-ui-section="pi_snake" data-ui-key="milestone_314">{{ ui.pi_snake.milestone_314 }}</span></li>
    </ul>
  </div>

  <div class="pi_snake-pad" aria-label="Snake controls">
    <button type="button" data-direction="up" aria-label="{{ ui.pi_snake.up }}" data-ui-aria-section="pi_snake" data-ui-aria-key="up">↑</button>
    <button type="button" data-direction="left" aria-label="{{ ui.pi_snake.left }}" data-ui-aria-section="pi_snake" data-ui-aria-key="left">←</button>
    <button type="button" data-direction="down" aria-label="{{ ui.pi_snake.down }}" data-ui-aria-section="pi_snake" data-ui-aria-key="down">↓</button>
    <button type="button" data-direction="right" aria-label="{{ ui.pi_snake.right }}" data-ui-aria-section="pi_snake" data-ui-aria-key="right">→</button>
  </div>
</div>

{% assign snake_share_url = "https://ashok314.github.io/pi_snake/" %}
<div class="pi_snake-challenge">
  <p class="pi_snake-agent-challenge" data-ui-section="pi_snake" data-ui-key="agent_challenge">{{ ui.pi_snake.agent_challenge }}</p>
  <a id="pi_snake-share-x" class="pi_snake-share" href="https://twitter.com/intent/tweet?text={{ ui.pi_snake.share_text | uri_escape }}&url={{ snake_share_url | uri_escape }}" target="_blank" rel="noopener" aria-label="{{ ui.pi_snake.share_x }}" title="{{ ui.pi_snake.share_x }}" data-ui-aria-section="pi_snake" data-ui-aria-key="share_x" data-ui-title-section="pi_snake" data-ui-title-key="share_x">
    <svg viewBox="0 0 1200 1227" width="16" height="16" aria-hidden="true"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/></svg>
  </a>
</div>
<footer class="pi_snake-credit">
  <span data-ui-section="pi_snake" data-ui-key="credit">{{ ui.pi_snake.credit }}</span>
  <strong data-ui-section="pi_snake" data-ui-key="built_for_agents">{{ ui.pi_snake.built_for_agents }}</strong>
</footer>

<style>
  .pi_snake { max-width: 38rem; margin: 1.5rem auto 0; padding: 1rem; border: 1px solid var(--theme-border); border-radius: 0.75rem; background: var(--theme-surface); }
  .pi_snake [hidden] { display: none !important; }
  .pi_snake-meta { display: flex; justify-content: space-between; margin-bottom: 0.65rem; }
  .pi_snake-screen { position: relative; }
  #pi_snake-board { display: block; box-sizing: border-box; width: 100%; height: auto; aspect-ratio: 1; border: 1px solid var(--theme-border); border-radius: 0.5rem; background: var(--theme-bg); touch-action: none; }
  #pi_snake-board.milestone { border-color: #c49000; box-shadow: 0 0 0 3px rgba(196, 144, 0, 0.35); }
  #pi_snake-board.game-over { border: 3px solid #ff0033 !important; }
  .pi_snake-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.45rem; padding: 2rem; border-radius: 0.5rem; background: transparent; color: var(--theme-text); text-align: center; pointer-events: none; }
  .pi_snake-overlay strong { padding: 0.5rem 0.85rem; border: 1px solid var(--theme-border); border-radius: 0.4rem; background: var(--theme-surface); color: var(--theme-text); font-size: 1.8rem; }
  .pi_snake-overlay[data-state="game_over"] strong { padding: 0; border: 0; background: transparent; color: var(--theme-text); font-size: 2.25rem; }
  .pi_snake-overlay.achievement strong { color: #9a7000; }
  .pi_snake-overlay span { max-width: 28rem; padding: 0.4rem 0.65rem; border-radius: 0.35rem; background: var(--theme-surface); color: var(--theme-text); }
  .pi_snake-start-overlay { position: absolute; top: 50%; left: 50%; z-index: 2; transform: translate(-50%, -50%); }
  .pi_snake-start-overlay.restart { top: 62%; }
  .pi_snake-actions { display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.75rem; }
  .pi_snake button { padding: 0.55rem 0.9rem; border: 1px solid var(--theme-border); border-radius: 0.4rem; background: var(--theme-bg); color: var(--theme-text); cursor: pointer; font: inherit; }
  .pi_snake button:disabled { cursor: default; opacity: 0.45; }
  #pi_snake-start { background: var(--theme-link); color: var(--theme-bg); }
  .pi_snake-shortcuts { margin: 0.6rem 0 0; color: var(--theme-muted); font-size: 0.85rem; }
  .pi_snake-challenge { display: flex; align-items: center; gap: 0.75rem; max-width: 38rem; margin: 0.9rem auto 0; }
  .pi_snake-agent-challenge { flex: 1; margin: 0; padding-left: 0.75rem; border-left: 2px solid var(--theme-link); font-size: 0.9rem; }
  .pi_snake-share, .pi_snake-share:visited { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: 1px solid var(--theme-border); border-radius: 50%; color: var(--theme-text); text-decoration: none; }
  .pi_snake-share:hover, .pi_snake-share:focus-visible { border-color: var(--theme-text); }
  .pi_snake-credit { display: grid; gap: 0.12rem; max-width: 38rem; margin: 1.4rem auto 0; color: var(--theme-muted); font-size: 0.72rem; text-align: center; }
  .pi_snake-credit strong { color: inherit; font-weight: 500; }
  .pi_snake-achievements { margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid var(--theme-border); }
  .pi_snake-achievements ul { margin: 0.5rem 0 0; padding: 0; list-style: none; }
  .pi_snake-achievements li { display: flex; gap: 0.45rem; margin: 0.35rem 0; color: var(--theme-text); font-size: 0.85rem; }
  .pi-achievement-mark { color: #22a652; font-weight: 700; }
  .pi_snake-pad { display: grid; grid-template-columns: repeat(3, 3.25rem); grid-template-rows: repeat(2, 3.25rem); justify-content: center; gap: 0.35rem; margin-top: 1rem; }
  .pi_snake-pad button { width: 3.25rem; height: 3.25rem; padding: 0; font-size: 1.25rem; touch-action: manipulation; }
  .pi_snake-pad [data-direction="up"] { grid-column: 2; }
  .pi_snake-pad [data-direction="left"] { grid-column: 1; grid-row: 2; }
  .pi_snake-pad [data-direction="down"] { grid-column: 2; grid-row: 2; }
  .pi_snake-pad [data-direction="right"] { grid-column: 3; grid-row: 2; }
  @media (pointer: fine) { .pi_snake-pad { display: none; } }
</style>

<script src="{{ '/assets/js/pi_snake.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
