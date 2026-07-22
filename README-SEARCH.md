# Civilisation search correction

Upload all nine HTML files in this folder to the root of the `EnglishCollesInLyon` GitHub repository, replacing files with the same names.

## What changes
- `civilisation.html` loads and indexes the DATA object from all eight country atlases.
- The search bar covers 1,006 knowledge entries, not only the eight country cards.
- Suggestions appear while typing and show the entry title, country, date or section, and a short summary.
- Clicking a suggestion opens the correct atlas and scrolls to the exact card (`#card-ID`).
- Search is accent-insensitive, so `Maori` also finds `Māori` and `Tiriti` finds `Te Tiriti`.
- If an atlas fails to load, the status message reports it rather than silently hiding the problem.

## Important
The full search requires the new atlas files because it reads their embedded `const DATA=...` objects. The old prototype files cannot be indexed.

After uploading, hard-refresh the page with Ctrl + F5 or Ctrl + Shift + R.
