---
layout: home
title: Cooking
permalink: /cooking/
---

*Recipes, experiments, and things worth eating.*

---

{% for recipe in site.cooking reversed %}
**[{{ recipe.title }}]({{ recipe.url }})**
*{{ recipe.date | date: "%B %d, %Y" }}*{% if recipe.tags.size > 0 %} · {% for tag in recipe.tags %}#{{ tag }} {% endfor %}{% endif %}

{{ recipe.tagline }}

---
{% endfor %}

