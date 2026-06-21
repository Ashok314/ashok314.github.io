---
layout: home
title: tech.log
permalink: /tech/
ui_page: tech
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<p><em lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="tech_tagline">{{ ui.pages.tech_tagline }}</em></p>

---

{% for post in site.tech reversed %}
**[{{ post.title }}]({{ post.url }})**
*{{ post.date | date: "%B %d, %Y" }}*{% if post.type %} · {{ post.type }}{% endif %}

{{ post.tagline }}

---
{% endfor %}

→ <span lang="{{ interface_lang }}" data-ui-section="pages" data-ui-key="tech_cross_posted">{{ ui.pages.tech_cross_posted }}</span> [Hashnode](https://pi.hashnode.dev)

