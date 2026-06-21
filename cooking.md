---
layout: home
title: Cooking
permalink: /cooking/
ui_page: cooking
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="cooking_tagline">{{ ui.pages.cooking_tagline }}</em></p>

---

{% for recipe in site.cooking reversed %}
**[{{ recipe.title }}]({{ recipe.url }})**
*{{ recipe.date | date: "%B %d, %Y" }}*{% if recipe.tags.size > 0 %} · {% for tag in recipe.tags %}#{{ tag }} {% endfor %}{% endif %}

{{ recipe.tagline }}

---
{% endfor %}
