# Global search

The shared header now opens one site-wide search dialog from every public page.

## Indexed content

- main pages and important sections;
- 86 grammar chapters;
- 86 vocabulary chapters and 11,122 individual vocabulary entries;
- methodology modules, lesson sections and interactive tools;
- country atlases and verified timeline events;
- pronunciation lessons;
- curated resources;
- jury-report warnings, formats and practice actions.

English and French vocabulary forms are searchable. Basic spelling mistakes are tolerated for longer words. Results link to the relevant page and, when possible, scroll directly to and highlight the indexed item.

## Rebuilding the index

Run:

```bash
python build_search_index.py
```

This generates:

- `search-index.json` for the main teaching content;
- `search-vocabulary-index.json` for the compact vocabulary index.

The GitHub Actions workflow `.github/workflows/build-global-search.yml` rebuilds and commits both files when one of the structured teaching datasets or core pages changes. It can also be run manually from the Actions tab.

## Keyboard controls

- `Ctrl + K` or `/`: open search;
- `Up` / `Down`: move through suggestions;
- `Enter`: open the selected or first suggestion;
- `Esc`: close search.
