---
layout: default
title: 検索
permalink: /search/
lang: ja
---

{% assign interface_lang = page.ui_lang | default: site.ui_lang | default: "en" %}
{% assign ui = site.data.ui[interface_lang] | default: site.data.ui.en %}

<div class="site-search" lang="{{ interface_lang }}" data-ui-page>
  <h1 data-ui-section="search" data-ui-key="title">{{ ui.search.title }}</h1>
  <div class="search-options">
    <label for="search-type"><span data-ui-section="search" data-ui-key="content_type">{{ ui.search.content_type }}</span>
      <select id="search-type">
        <option value="all" data-ui-section="search" data-ui-key="all">{{ ui.search.all }}</option>
        <option value="page" data-ui-section="search" data-ui-key="pages">{{ ui.search.pages }}</option>
        <option value="tech" data-ui-section="search" data-ui-key="tech">{{ ui.search.tech }}</option>
        <option value="recipe" data-ui-section="search" data-ui-key="recipes">{{ ui.search.recipes }}</option>
        <option value="poem" data-ui-section="search" data-ui-key="poems">{{ ui.search.poems }}</option>
        <option value="free-writing" data-ui-section="search" data-ui-key="free_writing">{{ ui.search.free_writing }}</option>
      </select>
    </label>
    <label class="search-regex"><input id="search-regex" type="checkbox"> <span data-ui-section="search" data-ui-key="regex">{{ ui.search.regex }}</span></label>
  </div>
  <label class="search-input-label" for="site-search-input" data-ui-section="search" data-ui-key="label">{{ ui.search.label }}</label>
  <div class="search-input-row">
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M12.8 12.8L17 17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input id="site-search-input" type="search" placeholder="{{ ui.search.placeholder }}" autocomplete="off" data-ui-placeholder-section="search" data-ui-placeholder-key="placeholder">
  </div>
  <p id="search-summary" class="search-summary" aria-live="polite"></p>
  <ul id="search-results" class="search-results"></ul>
</div>

<script id="site-search-data" type="application/json">
[
{% assign first_search_item = true %}
{% assign home_page = site.html_pages | where: 'url', '/' | first %}
{% if home_page %}
  {"title":{{ site.title | jsonify }},"url":{{ '/' | relative_url | jsonify }},"type":"page","lang":"en","date":"","content":{{ home_page.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endif %}
{% for item in site.html_pages %}
  {% if item.url != '/search/' and item.title %}
    {% unless first_search_item %},{% endunless %}
    {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"page","lang":{{ item.lang | default: site.lang | default: 'en' | jsonify }},"date":{{ item.date | date: '%Y-%m-%d' | default: '' | jsonify }},"content":{{ item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
    {% assign first_search_item = false %}
  {% endif %}
{% endfor %}
{% for item in site.tech %}
  {% unless first_search_item %},{% endunless %}
  {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"tech","lang":{{ item.lang | default: site.lang | default: 'en' | jsonify }},"date":{{ item.date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.tagline | append: ' ' | append: item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endfor %}
{% for item in site.cooking %}
  {% unless first_search_item %},{% endunless %}
  {"title":{{ item.title | jsonify }},"url":{{ item.url | relative_url | jsonify }},"type":"recipe","lang":{{ item.lang | default: site.lang | default: 'en' | jsonify }},"date":{{ item.date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.tagline | append: ' ' | append: item.content | markdownify | strip_html | normalize_whitespace | jsonify }}}
  {% assign first_search_item = false %}
{% endfor %}
{% for item in site.poems %}
  {% if item.published %}
    {% unless first_search_item %},{% endunless %}
    {"title":{{ item.title | default: 'Untitled' | jsonify }},"url":{{ '/poems/#' | append: item.slug | relative_url | jsonify }},"type":{{ item.type | default: 'Poem' | jsonify }},"lang":{{ item.language | default: 'en' | jsonify }},"date":{{ item.written_date | date: '%Y-%m-%d' | jsonify }},"content":{{ item.content | append: ' ' | append: item.backstory | markdownify | strip_html | normalize_whitespace | jsonify }}}
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
      const text = value.replace(/\b(type|lang|year|after|before):("[^"]+"|\S+)/gi, (_, key, filterValue) => {
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
      const searchUI = window.siteUI ? window.siteUI.strings().search : {{ ui.search | jsonify }};
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
          summary.textContent = `${searchUI.invalid_regex} ${error.message}`;
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
        const itemLang = item.lang.toLocaleLowerCase();
        const itemDate = item.date || '';
        const filters = plainQuery.filters;
        if (filters.type && itemType !== filters.type.toLocaleLowerCase()) return false;
        if (filters.lang && itemLang !== filters.lang.toLocaleLowerCase()) return false;
        if (filters.year && !itemDate.startsWith(filters.year)) return false;
        if (filters.after && (!itemDate || itemDate <= filters.after)) return false;
        if (filters.before && (!itemDate || itemDate >= filters.before)) return false;

        if (plainQuery.groups.length === 0) return true;
        const normalized = searchable.toLocaleLowerCase();
        return plainQuery.groups.some((group) => group.every((term) => normalized.includes(term)));
      });

      const countLabel = matches.length === 1 ? searchUI.result : searchUI.results;
      summary.textContent = countLabel.replace('{count}', matches.length);

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
        type.textContent = searchUI.types[item.type] || item.type;
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
    window.addEventListener('ui-language-change', showResults);

    const parameters = new URLSearchParams(window.location.search);
    input.value = parameters.get('q') || '';
    if (parameters.has('type')) typeSelect.value = parameters.get('type');
    regexInput.checked = parameters.get('regex') === 'true';
    showResults();
  })();
</script>
