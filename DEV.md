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
_tech/                  # one .md file per tech post → /tech/:name/
_layouts/recipe.html    # layout for recipes
_layouts/article.html   # layout for tech articles (with optional disclaimer)
_includes/              # custom partials (if any)
assets/cooking/         # recipe images → /assets/cooking/slug.jpg
cooking.md              # auto-lists all recipes in _cooking/
tech.md                 # auto-lists all posts in _tech/
index.md                # main profile (EN)
ja.md                   # main profile (JA)
```

---

## Add a new tech post

1. Create `_tech/post-slug.md`
2. Use this frontmatter:

```yaml
---
layout: article
title: "Post Title"
tagline: One-line description.
date: YYYY-MM-DD
type: article        # article | tutorial | blog | note
tags: ["tag1", "tag2"]
version: "1.0"
```yaml
generated: false     # true if AI-generated content
author_note: false   # true if AI-generated but includes a human-written section
source_url: ""       # original chat/source link (if generated: true)
prompt: |            # multiline prompt (if generated: true)
  Your prompt here
```

**Content flags — what shows in the article header:**

| `generated` | `author_note` | Displayed as |
|---|---|---|
| `false` | — | *(no flag)* — fully human written |
| `true` | `false` | 🤖 AI-generated content |
| `true` | `true` | 🤖 AI-generated · includes a note from the author |
changelog:
  - date: YYYY-MM-DD
    note: Initial publish
references:
  - title: "Reference Title"
    url: "https://..."
    note: "Optional description"
---
```

3. Preview locally, then push

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

---

## Updating existing content

### Edit any page or article

1. Open the file, make changes
2. Preview locally
3. Push — done

### Get word count and read time for an article

```bash
# body word count (excludes front matter)
awk 'BEGIN{fm=0} /^---/{fm++; next} fm>=2{print}' _tech/your-article.md | wc -w

# total file word count (includes front matter)
wc -w _tech/your-article.md
```

Read time = word count ÷ 200 (average reading speed in wpm). Add to frontmatter:

```yaml
word_count: 1298
read_time: 7
```

---

### Update a tech article (versioned)

1. Edit `_tech/your-article.md`
2. Bump `version` (e.g. `"1.0"` → `"1.1"`)
3. Add `updated` date:
   ```yaml
   updated: YYYY-MM-DD
   ```
4. Add a `changelog` entry:
   ```yaml
   changelog:
     - date: YYYY-MM-DD
       note: What changed
     - date: YYYY-MM-DD
       note: Initial publish
   ```
5. Preview, push

### Add/fix a reference

Edit the `references` list in the frontmatter:
```yaml
references:
  - title: "Title"
    url: "https://..."
    note: "Optional context"
```
No layout changes needed — renders automatically.

### Update the profile

- English → `index.md`
- Japanese → `ja.md`
- Both files should stay in sync for any factual changes (job titles, skills, etc.)

### Update nav order

Edit `header_pages` in `_config.yml`. Restart Jekyll locally after config changes.

