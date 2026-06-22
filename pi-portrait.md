---
layout: home
title: Pi Portrait
permalink: /pi-portrait/
ui_page: pi_portrait
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="pi_portrait_tagline">{{ ui.pages.pi_portrait_tagline }}</p>

<div id="pi-portrait-tool" class="pi-tool" data-digits-url="{{ '/assets/pi-digits.txt' | relative_url }}" data-sample-url="{{ '/assets/avatar-original.jpg' | relative_url }}">
  <div class="pi-tool-bar">
    <label class="pi-upload" for="pi-image" data-ui-section="pi_tool" data-ui-key="choose_image">{{ ui.pi_tool.choose_image }}</label>
    <input id="pi-image" type="file" accept="image/*">
    <button id="pi-use-sample" type="button" data-ui-section="pi_tool" data-ui-key="use_sample">{{ ui.pi_tool.use_sample }}</button>
    <span id="pi-file-name" data-ui-section="pi_tool" data-ui-key="no_image">{{ ui.pi_tool.no_image }}</span>
  </div>

  <div class="pi-tool-grid">
    <div>
      <canvas id="pi-crop" width="320" height="320" aria-label="Image crop preview"></canvas>
      <fieldset disabled id="pi-framing">
        <legend data-ui-section="pi_tool" data-ui-key="frame">{{ ui.pi_tool.frame }}</legend>
        <label for="pi-x"><span data-ui-section="pi_tool" data-ui-key="horizontal">{{ ui.pi_tool.horizontal }}</span> <input id="pi-x" type="range" min="0" max="100" value="50"></label>
        <label for="pi-y"><span data-ui-section="pi_tool" data-ui-key="vertical">{{ ui.pi_tool.vertical }}</span> <input id="pi-y" type="range" min="0" max="100" value="50"></label>
        <label for="pi-zoom"><span data-ui-section="pi_tool" data-ui-key="zoom">{{ ui.pi_tool.zoom }}</span> <input id="pi-zoom" type="range" min="100" max="250" value="100"></label>
      </fieldset>
    </div>

    <div class="pi-tool-options">
      <label for="pi-detail" data-ui-section="pi_tool" data-ui-key="detail">{{ ui.pi_tool.detail }}</label>
      <select id="pi-detail">
        <option value="12721" data-ui-section="pi_tool" data-ui-key="digits_12721">{{ ui.pi_tool.digits_12721 }}</option>
        <option value="31415" data-ui-section="pi_tool" data-ui-key="digits_31415">{{ ui.pi_tool.digits_31415 }}</option>
        <option value="100000" selected data-ui-section="pi_tool" data-ui-key="digits_100000">{{ ui.pi_tool.digits_100000 }}</option>
      </select>

      <label for="pi-color" data-ui-section="pi_tool" data-ui-key="palette">{{ ui.pi_tool.palette }}</label>
      <select id="pi-color">
        <option value="normal" selected data-ui-section="pi_tool" data-ui-key="normal">{{ ui.pi_tool.normal }}</option>
        <option value="blackwhite" data-ui-section="pi_tool" data-ui-key="black_white">{{ ui.pi_tool.black_white }}</option>
        <option value="neo" data-ui-section="theme" data-ui-key="neo">{{ ui.theme.neo }}</option>
        <option value="matrix" data-ui-section="theme" data-ui-key="matrix">{{ ui.theme.matrix }}</option>
        <option value="custom" data-ui-section="pi_tool" data-ui-key="custom">{{ ui.pi_tool.custom }}</option>
      </select>

      <div id="pi-custom-colors" hidden>
        <label for="pi-background-color"><span data-ui-section="pi_tool" data-ui-key="background">{{ ui.pi_tool.background }}</span> <input id="pi-background-color" type="color" value="#ffffff"></label>
        <label for="pi-digit-color"><span data-ui-section="pi_tool" data-ui-key="digit_color">{{ ui.pi_tool.digit_color }}</span> <input id="pi-digit-color" type="color" value="#111111"></label>
      </div>

      <button id="pi-generate" type="button" disabled data-ui-section="pi_tool" data-ui-key="generate">{{ ui.pi_tool.generate }}</button>
      <a id="pi-download-svg" class="pi-download" hidden download="pi-portrait.svg" data-ui-section="pi_tool" data-ui-key="download_svg">{{ ui.pi_tool.download_svg }}</a>
      <a id="pi-download-png" class="pi-download" hidden download="pi-portrait.png" data-ui-section="pi_tool" data-ui-key="download_png">{{ ui.pi_tool.download_png }}</a>
      <p id="pi-status" role="status" aria-live="polite"></p>
    </div>
  </div>

  <img id="pi-result" hidden width="640" height="640" alt="Generated portrait composed of pi digits">
</div>

<style>
  .pi-tool { margin-top: 1.5rem; padding: 1.25rem; border: 1px solid var(--theme-border); border-radius: 0.75rem; background: var(--theme-surface); }
  .pi-tool [hidden] { display: none !important; }
  .pi-tool-bar { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .pi-upload, #pi-use-sample, #pi-generate, .pi-download { display: inline-block; padding: 0.55rem 0.9rem; border: 1px solid var(--theme-border); border-radius: 0.4rem; background: var(--theme-bg); color: var(--theme-text); cursor: pointer; font: inherit; text-decoration: none; }
  #pi-image { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
  #pi-file-name, #pi-status { color: var(--theme-muted); font-size: 0.9rem; }
  .pi-tool-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.7fr); gap: 1.25rem; }
  #pi-crop, #pi-result { display: block; width: 100%; height: auto; border-radius: 0.5rem; background: var(--theme-bg); }
  #pi-framing { display: grid; gap: 0.5rem; margin: 0.75rem 0 0; padding: 0; border: 0; }
  #pi-framing label { display: grid; grid-template-columns: 6rem 1fr; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
  #pi-framing input { width: 100%; }
  #pi-framing:disabled { opacity: 0.45; }
  .pi-tool-options { display: flex; flex-direction: column; gap: 0.6rem; }
  .pi-tool-options select { width: 100%; padding: 0.5rem; border: 1px solid var(--theme-border); border-radius: 0.35rem; background: var(--theme-bg); color: var(--theme-text); font: inherit; }
  #pi-custom-colors { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  #pi-custom-colors label { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.9rem; }
  #pi-custom-colors input { width: 2.5rem; height: 2rem; padding: 0; border: 1px solid var(--theme-border); background: transparent; }
  #pi-generate { margin-top: 0.5rem; background: var(--theme-link); color: var(--theme-bg); }
  #pi-generate:disabled { cursor: default; opacity: 0.45; }
  .pi-download { text-align: center; }
  #pi-result { margin-top: 1.25rem; }
  @media (max-width: 600px) { .pi-tool-grid { grid-template-columns: 1fr; } .pi-tool-bar { align-items: flex-start; flex-direction: column; } }
</style>

<noscript>This tool requires JavaScript.</noscript>
<script src="{{ '/assets/js/pi-portrait.js' | relative_url }}" defer></script>
