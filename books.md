---
layout: home
title: Books
permalink: /books/
ui_page: books
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="books_tagline">{{ ui.pages.books_tagline }}</em></p>

---

<!-- Format:
**Title** — Author
*Genre · Year read*
One-line takeaway or note.
-->

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="books_empty">{{ ui.pages.books_empty }}</em></p>
