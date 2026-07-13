# English Colles in Lyon — Resource Hub

This pack replaces the old listening-method page with a curated resource library.

## Files to upload at the root of the repository
- `resources.html` — replace the existing file
- `resources-data.json` — permanent curated library (144 resources)
- `resources-feed.json` — automatic latest-content feed
- `resources-link-status.json` — result of the weekly link check
- `package.json` — dependency used by the automatic feed updater
- `scripts/update-resources.mjs`
- `scripts/check-resource-links.mjs`

## Workflow files
These must keep their folders:
- `.github/workflows/update-resources.yml`
- `.github/workflows/check-resource-links.yml`

## What works immediately
Search, filters, categories, countries, favourites, random selection and the complete permanent resource library.

## What becomes automatic after the workflow is enabled
- The “Fresh from reliable sources” cards are refreshed twice a day.
- All permanent links are checked every Monday.
- Both workflows can also be launched manually from the GitHub **Actions** tab.

## Important GitHub setting
In **Settings → Actions → General → Workflow permissions**, select **Read and write permissions** so the workflows can update the two JSON files.
