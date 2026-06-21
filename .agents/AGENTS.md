# ashok314.github.io — Agent Policy

This file is mandatory policy for agents changing this repository. Read `DEV.md` for the stack, commands, structure, and content workflows. `TODO.md` contains ideas only; it does not authorize implementation.

## Rules

1. Make only the requested change. No unrelated cleanup, refactoring, rewriting, or comments.
2. Ask before making an unspecified content or design decision.
3. Do not run git or Jekyll unless explicitly asked.
4. Never edit `_site/`; it is generated output.
5. Preserve existing user changes and exact company names, including Eigyo Mfg Co., Ltd.
6. Do not silently correct poems, personal stories, quotations, dates, or factual claims.
7. Keep all changes compatible with GitHub Pages.
8. Prefer existing Jekyll, Liquid, Markdown, and Minima behavior over dependencies or plugins.
9. UI must be restrained, readable, responsive, and consistent with its page. Functionality alone is not enough.
10. Do not add prominent buttons, banners, cards, animations, or generic browser-style controls without approval of their appearance and placement.
11. When reverting a feature, remove all related markup, styles, scripts, and documentation.

## System invariants

- `_config.yml` controls navigation, collections, defaults, and site metadata.
- Keep `title: ashok314`; the human name belongs in `author`.
- `lang` describes page content. Fixed UI strings come from `_data/ui.yml`; the header switch changes `ui_lang` client-side and remembers the choice. Japanese is the default and English is the fallback.
- Centralize fixed page titles, taglines, empty states, and footer copy in `_data/ui.yml`; do not duplicate them across page files.
- `_tech/` and `_cooking/` are output collections using layout defaults from `_config.yml`.
- `_poems/` is not output directly; `poems.md` renders published entries at `/poems/`.
- Listing pages are generated from collections. Do not add collection entries manually.
- `_includes/head.html`, `_includes/header.html`, and `_includes/footer.html` override Minima.
- The header provides global search. `search.md` indexes pages, tech, recipes, and published poems, with type, language, date, and separate regex filtering.
- The footer's “Report an issue” link must retain the current page URL.
- `assets/logo_1.gif` is the favicon.

## Visual policy

- Minima is the default style.
- Do not add `_includes/head-custom.html`, `assets/css/`, or a global stylesheet without approval.
- Keep approved custom presentation scoped in `_includes/head.html`.
- Lokta/nepali-kagaj styling is exclusive to poems.
- Tech pages use the scoped newspaper/editorial style without texture or multi-column body text.
- Animated effects must respect `prefers-reduced-motion`.

## Content rules

- Follow the front-matter and authoring workflows in `DEV.md`.
- Tech articles use `_layouts/article.html`; it calculates word count and read time.
- Recipes follow: story, ingredients table, numbered method.
- Poems use `type: poem` or `type: free-writing`, `language: en|ne|ja`, and `published: true` to appear.
- In poems, source newlines create line breaks; do not add trailing `\`. Blank lines separate stanzas.
- Poem backstories use a multiline `backstory: |` front-matter field.
- Keep factual profile updates synchronized between `index.md` and `ja.md` only when the task calls for both languages.
- Keep content in its authored language. Do not generate translations. Poems always remain in their original language.
