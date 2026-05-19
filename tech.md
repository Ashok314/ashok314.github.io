---
layout: home
title: tech.log
permalink: /tech/
---

*Articles, tutorials, opinions, and things worth writing down.*

---

{% for post in site.tech reversed %}
**[{{ post.title }}]({{ post.url }})**
*{{ post.date | date: "%B %d, %Y" }}*{% if post.type %} · {{ post.type }}{% endif %}

{{ post.tagline }}

---
{% endfor %}

→ Cross-posted on [Hashnode](https://pi.hashnode.dev)


