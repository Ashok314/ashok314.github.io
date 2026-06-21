---
layout: home
title: Films
permalink: /films/
ui_page: films
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="films_tagline">{{ ui.pages.films_tagline }}</em></p>

---

<!-- Format:
**Title** *(Year)* — Director
Rating · Genre
One-line reaction or theme.
-->

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="films_empty">{{ ui.pages.films_empty }}</em></p>
