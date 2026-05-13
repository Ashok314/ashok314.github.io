# Dev Notes

## Run locally

```bash
bundle install          # first time only
bundle exec jekyll serve --livereload

# if port 35729 is already in use (livereload conflict):
lsof -ti :35729 | xargs kill -9 && bundle exec jekyll serve --livereload

# or just skip livereload (manual refresh):
bundle exec jekyll serve
```

Open **http://localhost:4000**. Changes reload automatically.

---

## Structure

```
_config.yml             # site config, collections, nav
_cooking/               # one .md file per recipe → /cooking/:name/
_layouts/recipe.html    # layout for individual recipes
_includes/              # custom partials (if any)
assets/cooking/         # recipe images → /assets/cooking/slug.jpg
cooking.md              # auto-lists all recipes in _cooking/
index.md                # main profile (EN)
ja.md                   # main profile (JA)
```

---

## Add a new recipe

1. Create `_cooking/recipe-slug.md`
2. Use this frontmatter:

```yaml
---
layout: recipe
title: Recipe Title
tagline: One-line description.
date: YYYY-MM-DD
tags: [tag1, tag2]
image: /assets/cooking/recipe-slug.jpg
---
```

3. Drop image in `assets/cooking/recipe-slug.jpg`
4. Preview locally, then push

---

## Deploy

```bash
git add .
git commit -m "your message"
git push
```

GitHub Pages builds automatically. Live in ~30s at **https://ashok314.github.io**.
