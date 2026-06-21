---
layout: home
title: Search
permalink: /search/
---

<div class="site-search">
  <label for="site-search-input">Search pages, articles, recipes, and poems</label>
  <input id="site-search-input" type="search" placeholder="Type at least two characters" autocomplete="off">
  <div class="search-options">
    <label for="search-type">Content type
      <select id="search-type">
        <option value="all">All content</option>
        <option value="page">Pages</option>
        <option value="tech">Tech</option>
        <option value="recipe">Recipes</option>
        <option value="poem">Poems</option>
        <option value="free-writing">Free writing</option>
      </select>
    </label>
    <label class="search-regex"><input id="search-regex" type="checkbox"> Use regular expression</label>
  </div>
  <p class="search-help"><code>AI OR LLM</code> · <code>"exact phrase"</code> · <code>type:tech</code> · <code>year:2021</code> · <code>after:2020-01-01</code> · <code>before:2024-12-31</code></p>
  <p id="search-summary" class="search-summary" aria-live="polite"></p>
  <ul id="search-results" class="search-results"></ul>
</div>

<script id="site-search-data" type="application/json">
[
{% assign first_search_item = true %}
{% assign home_page = site.html_pages | where: 'url', '/' | first %}
{% if home_page %}
  {"title":"Home","url":{{ '/' | relative_url | jsonify }},"type":"Page","date":"","content":{{ home_page.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endif %}
{% for item in site.html_pages %}
  {% if item.url != '/search/' and item.title %}
    {% unless first_search_item %},{% endunless %}
    {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"Page","date":{{ item.date | date: '%Y-%m-%d' | default: '' | jsonify }},"content":{{ item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
    {% assign first_search_item = false %}
  {% endif %}
{% endfor %}
{% for item in site.tech %}
  {% unless first_search_item %},{% endunless %}
  {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"Tech","date":{{ item.date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.tagline | append: ' ' | append: item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endfor %}
{% for item in site.cooking %}
  {% unless first_search_item %},{% endunless %}
  {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"Recipe","date":{{ item.date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.tagline | append: ' ' | append: item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endfor %}
{% for item in site.poems %}
  {% if item.published %}
    {% unless first_search_item %},{% endunless %}
    {"title":{{ item.title | default: 'Untitled' | jsonify }},"url":{{ '/poems/#' | append: item.slug | relative_url | jsonify }},"type":{{ item.type | default: 'Poem' | jsonify }},"date":{{ item.written_date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.content | append: ' ' | append: item.backstory | markdownify | strip_html | normalize_whitespace | jsonify }}}
    {% assign first_search_item = false %}
  {% endif %}
{% endfor %}
]
</script>

<script>
  (() => {
    const input = document.getElementById('site-search-input');
    const typeSelect = document.getElementById('search-type');
    const regexInput = document.getElementById('search-regex');
    const summary = document.getElementById('search-summary');
    const results = document.getElementById('search-results');
    const items = JSON.parse(document.getElementById('site-search-data').textContent);

    const parsePlainQuery = (value) => {
      const filters = {};
      const text = value.replace(/\b(type|year|after|before):("[^"]+"|\S+)/gi, (_, key, filterValue) => {
        filters[key.toLocaleLowerCase()] = filterValue.replace(/^"|"$/g, '');
        return '';
      }).trim();

      const groups = text.split(/\s+OR\s+/i).map((group) => {
        const terms = [];
        group.replace(/"([^"]+)"|(\S+)/g, (_, phrase, word) => {
          terms.push((phrase || word).toLocaleLowerCase());
          return '';
        });
        return terms;
      }).filter((group) => group.length > 0);

      return { filters, groups };
    };

    const showResults = () => {
      const rawQuery = input.value.trim();
      const query = rawQuery.toLocaleLowerCase();
      results.replaceChildren();

      if (rawQuery.length < 2) {
        summary.textContent = '';
        return;
      }

      let expression = null;
      let plainQuery = null;
      if (regexInput.checked) {
        try {
          expression = new RegExp(rawQuery, 'i');
        } catch (error) {
          summary.textContent = `Invalid regular expression: ${error.message}`;
          return;
        }
      } else {
        plainQuery = parsePlainQuery(rawQuery);
      }

      const matches = items.filter((item) => {
        const matchesType = typeSelect.value === 'all' || item.type.toLocaleLowerCase() === typeSelect.value;
        const searchable = `${item.title} ${item.content}`;
        if (!matchesType) return false;

        if (expression) return expression.test(searchable);

        const itemType = item.type.toLocaleLowerCase();
        const itemDate = item.date || '';
        const filters = plainQuery.filters;
        if (filters.type && itemType !== filters.type.toLocaleLowerCase()) return false;
        if (filters.year && !itemDate.startsWith(filters.year)) return false;
        if (filters.after && (!itemDate || itemDate <= filters.after)) return false;
        if (filters.before && (!itemDate || itemDate >= filters.before)) return false;

        if (plainQuery.groups.length === 0) return true;
        const normalized = searchable.toLocaleLowerCase();
        return plainQuery.groups.some((group) => group.every((term) => normalized.includes(term)));
      });

      summary.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'}`;

      matches.slice(0, 30).forEach((item) => {
        const text = item.content.replace(/\s+/g, ' ').trim();
        const firstTerm = plainQuery && plainQuery.groups.flat()[0];
        const matchAt = expression
          ? text.search(expression)
          : firstTerm
            ? text.toLocaleLowerCase().indexOf(firstTerm)
            : 0;
        const start = Math.max(0, matchAt - 65);
        const end = Math.min(text.length, start + 180);
        const snippet = `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;

        const row = document.createElement('li');
        const type = document.createElement('span');
        const link = document.createElement('a');
        const description = document.createElement('p');

        type.className = 'search-result-type';
        type.textContent = item.type;
        link.href = item.url;
        link.textContent = item.title;
        description.textContent = snippet;

        row.append(type, document.createElement('br'), link, description);
        results.append(row);
      });
    };

    input.addEventListener('input', showResults);
    typeSelect.addEventListener('change', showResults);
    regexInput.addEventListener('change', showResults);

    const parameters = new URLSearchParams(window.location.search);
    input.value = parameters.get('q') || '';
    if (parameters.has('type')) typeSelect.value = parameters.get('type');
    regexInput.checked = parameters.get('regex') === 'true';
    showResults();
  })();
</script>
