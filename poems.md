---
layout: default
title: Poems
permalink: /poems/
lang: mul
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}
{% assign published = site.poems | where: "published", true %}
{% assign lang_order = "en,ne,ja" | split: "," %}

<div class="poem-page">

<details class="poem-toc">
  <summary lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="index">{{ ui.poems.index }}</summary>
  <ul>
    {% for lang in lang_order %}
    {% assign lang_items = published | where: "language", lang %}
    {% if lang_items.size > 0 %}
    {% if lang == "ne" %}{% assign lang_label = "नेपाली" %}{% elsif lang == "ja" %}{% assign lang_label = "日本語" %}{% else %}{% assign lang_label = "English" %}{% endif %}
    <span class="toc-group-label">{{ lang_label }}</span>
    {% assign toc_poems = lang_items | where: "type", "poem" %}
    {% assign toc_fw = lang_items | where: "type", "free-writing" %}
    {% if toc_poems.size > 0 %}
    <span class="toc-type-label" lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="poems">{{ ui.poems.poems }}</span>
    {% for p in toc_poems %}
    <li><a href="#{{ p.slug }}">{{ p.title | default: "untitled" }}</a></li>
    {% endfor %}
    {% endif %}
    {% if toc_fw.size > 0 %}
    <span class="toc-type-label" lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="free_writing">{{ ui.poems.free_writing }}</span>
    {% for p in toc_fw %}
    <li><a href="#{{ p.slug }}">{{ p.title | default: "untitled" }}</a></li>
    {% endfor %}
    {% endif %}
    {% endif %}
    {% endfor %}
    <span class="toc-group-label" style="margin-top:0.8rem;">—</span>
    <li><a href="#about" lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="about">{{ ui.poems.about }}</a></li>
  </ul>
</details>

{% for lang in lang_order %}
{% assign lang_items = published | where: "language", lang %}
{% if lang_items.size > 0 %}
{% if lang == "ne" %}{% assign lang_label = "नेपाली" %}{% elsif lang == "ja" %}{% assign lang_label = "日本語" %}{% else %}{% assign lang_label = "English" %}{% endif %}

<span class="poem-section-label">{{ lang_label }}</span>

{% assign lang_poems = lang_items | where: "type", "poem" | sort: "written_date" | reverse %}
{% assign lang_fw    = lang_items | where: "type", "free-writing" | sort: "written_date" | reverse %}

{% if lang_poems.size > 0 %}
{% if lang_fw.size > 0 %}<span class="poem-type-sublabel" lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="poems">{{ ui.poems.poems }}</span>{% endif %}
{% for poem in lang_poems %}
<div class="poem-card lang-{{ lang }}" id="{{ poem.slug }}" data-lang="{{ lang }}">
  {% if poem.title and poem.title != "" %}<div class="poem-title">{{ poem.title }}</div>{% endif %}
  <div class="poem-body">{{ poem.content }}</div>
  <div class="poem-signature">{% if lang == "ja" %}<span class="hanko">あちゃりゃ</span>{% elsif lang == "ne" %}अशोक आचार्य{% else %}Ashok Acharya{% endif %}</div>
  {% if poem.written_place or poem.written_date %}
  <div class="poem-meta">
    {% if poem.written_place %}{{ poem.written_place }}{% endif %}{% if poem.written_place and poem.written_date %} &middot; {% endif %}{% if poem.written_date %}{{ poem.written_date | date: "%B %Y" }}{% endif %}
  </div>
  {% endif %}
  {% if poem.backstory and poem.backstory != "" %}
  <details class="poem-backstory">
    <summary lang="{{ interface_lang }}"><span aria-hidden="true">&#128214;</span> <span data-ui-section="poems" data-ui-key="backstory">{{ ui.poems.backstory }}</span></summary>
    <div class="poem-backstory-page">{{ poem.backstory | markdownify }}</div>
  </details>
  {% endif %}
</div>
{% endfor %}
{% endif %}

{% if lang_fw.size > 0 %}
{% if lang_poems.size > 0 %}<span class="poem-type-sublabel" lang="{{ interface_lang }}" data-ui-section="poems" data-ui-key="free_writing">{{ ui.poems.free_writing }}</span>{% endif %}
{% for piece in lang_fw %}
<div class="poem-card lang-{{ lang }}" id="{{ piece.slug }}" data-lang="{{ lang }}">
  {% if piece.title and piece.title != "" %}<div class="poem-title">{{ piece.title }}</div>{% endif %}
  <div class="poem-body">{{ piece.content }}</div>
  <div class="poem-signature">{% if lang == "ja" %}<span class="hanko">あちゃりゃ</span>{% elsif lang == "ne" %}अशोक आचार्य{% else %}Ashok Acharya{% endif %}</div>
  {% if piece.written_place or piece.written_date %}
  <div class="poem-meta">
    {% if piece.written_place %}{{ piece.written_place }}{% endif %}{% if piece.written_place and piece.written_date %} &middot; {% endif %}{% if piece.written_date %}{{ piece.written_date | date: "%B %Y" }}{% endif %}
  </div>
  {% endif %}
  {% if piece.backstory and piece.backstory != "" %}
  <details class="poem-backstory">
    <summary lang="{{ interface_lang }}"><span aria-hidden="true">&#128214;</span> <span data-ui-section="poems" data-ui-key="backstory">{{ ui.poems.backstory }}</span></summary>
    <div class="poem-backstory-page">{{ piece.backstory | markdownify }}</div>
  </details>
  {% endif %}
</div>
{% endfor %}
{% endif %}

{% unless forloop.last %}<hr class="poem-section-divider">{% endunless %}
{% endif %}
{% endfor %}

<div class="poem-page-about" id="about">
  <p>Writing across three languages — English, Nepali, and Japanese — collected from notebooks and late nights. Poems and free writing. Some from years ago, some recent. Language shapes what can be said. These try to say it anyway.</p>
  <hr class="about-sep">
  <p>These cards are styled after <em>lokta kagaj</em> — handmade Nepali paper crafted from the bark of the Daphne plant, grown in the Himalayas. Lokta has been made in Nepal for over a thousand years: rough at the edges, textured, warm. It holds ink differently than other paper. It feels like it was made to carry something personal. That felt right for this page.</p>
</div>

</div>
