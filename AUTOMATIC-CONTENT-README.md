# Automatic content and fallback system

This site keeps time-sensitive content in repository JSON files so the public pages remain usable even when an external feed or service is unavailable.

## Automated workflows

- **Update daily country news** — runs every day and refreshes `daily-news.json` for the United Kingdom, United States, Ireland, Canada, Australia, New Zealand, India and South Africa.
- **Update resource feed** — runs twice daily and refreshes `resources-feed.json` from a country-diverse set of public RSS feeds.
- **Check resource links** — runs weekly and updates `resources-link-status.json` without overwriting the last reliable report during a widespread network failure.
- **Update jury reports** — retains the existing jury-report monitoring system. The public page now keeps the last valid status in the browser if the live JSON cannot be reached.

## What visitors see

Each time-sensitive block has three possible states:

1. **Live content** — the most recent repository file loaded successfully.
2. **Saved content** — a previously valid result is shown and clearly labelled as saved or cached.
3. **Unavailable** — the block explains that no reliable content is available; it never presents an old item as today's update.

## First run after installation

In GitHub, open **Actions** and manually run these workflows once:

1. `Update daily country news`
2. `Update resource feed`
3. `Check resource links`

After that, their schedules run automatically. GitHub Pages may take a few minutes to publish a committed JSON update.

## Main files

- `scripts/update-daily-news.mjs`
- `scripts/update-resources.mjs`
- `scripts/check-resource-links.mjs`
- `.github/workflows/update-daily-news.yml`
- `.github/workflows/update-resources.yml`
- `.github/workflows/check-resource-links.yml`
- `service-worker.js`
