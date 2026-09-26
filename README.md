# Arash Pourdamghani's website

A static Eleventy site with Markdown, Nunjucks templates, YAML data, plain CSS,
and browser JavaScript. The generated website needs no server or client framework.

## Develop and build

Use Node.js 24 (also used by GitHub Actions) and npm. If you use nvm, run `nvm use`.

```sh
npm ci
npm start
```

Open the local URL printed by Eleventy. It watches content, templates, data, CSS,
and JavaScript; edits trigger a rebuild and browser reload.

```sh
npm run build  # Clean, offline build into _site/
npm run check  # Build, then check local links, assets, anchors, and homepage embeds
```

Builds use the committed lockfile and saved conference data. They do not fetch
conference websites or rewrite content. `_site/` is disposable and ignored by Git;
`npm run clean` removes only that generated directory.

## Edit the website

| Change | Source |
| --- | --- |
| Homepage introduction and section order | `_pages/about.md` and `_layouts/home.njk` |
| Publications | `_data/publications.yml` |
| Running records | `_data/running_records.yml` and `_pages/running-records.njk` |
| Teaching, supervision, service, talks, grants, CV | Matching files in `_pages/` |
| Profile and site metadata | `_data/metadata.yml` |
| Navigation for standalone pages | `_data/navigation.yml` |
| Shared page layouts | `_layouts/` and `_includes/*.njk` |
| Styling | Named sections in `assets/css/main.css`; no CSS compilation required |
| Browser controls and filters | `assets/js/` |
| Word Discovery Challenge | `wordle/` (published at `/tools/word-game/`) |

The homepage reuses the standalone pages' content, so edit each section once.
Keep page `permalink` values to preserve existing URLs. To add a page, create a
Markdown or Nunjucks file in `_pages/` with `layout`, `permalink`, and `title` in
its front matter.

PDFs, BibTeX files, and citation text in `_pages/` are published both at the root
and under `/_pages/` to preserve existing download links. Images live in `images/`.
The thesis slides and their media are prebuilt in `assets/thesis/`; ordinary site
builds copy them without requiring Manim, Python packages, or FFmpeg.

## Optional conference updates

The deadline updater uses Python 3's standard library. Python is optional for
local site development and builds.

```sh
npm run update:deadlines  # Fetch official sources and update the YAML data
npm run test:deadlines    # Run the updater's unit tests
```

Review changes to `_data/related_deadlines.yml` before committing them. The daily
GitHub Actions run and manual deployments refresh deadlines explicitly; push and
pull request builds use saved data.

To re-export thesis slides, see the command in `scripts/export_thesis_slides.py`.
It uses the separate thesis presentation project's Manim environment.

## Deployment

`.github/workflows/deploy.yml` installs dependencies, runs the checks, and deploys
`_site/` to GitHub Pages on pushes to `master`, a daily schedule, or manual runs.
Pull requests run checks without deploying. `CNAME` preserves the custom domain.

The retained theme-derived styles use the MIT license in `LICENSE`. Icon font
attribution is included in `assets/css/main.css`; the thesis slide viewer retains
its vendor license in `assets/thesis/vendor/LICENSE`.
