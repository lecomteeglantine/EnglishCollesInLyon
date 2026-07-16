# English Colles in Lyon — Help · Lot 1

## Files in this lot

- `help.html`: the new **Your Guided Learning Plan** page.
- `help-data.js`: 51 mapped skills across Grammar, Vocabulary, Pronunciation, Methodology, Civilisation and Colle Skills.
- `help-engine.js`: adaptive diagnostics, generated plans, mission completion, new progress checks, later cycles and local browser storage.
- `INDEX-HELP-CARD.html`: the exact card to insert on the homepage.

## What already works

- An initial diagnostic across all six domains.
- A generated plan with up to seven missions.
- The five-part mission structure: **Learn · Practise · Say it aloud · Use it · Check what you can do**.
- Specific, evidence-based feedback rather than artificial praise.
- A new progress check after every completed plan.
- Repeated cycles until the mapped skills are ready or consolidated.
- A complete roadmap and progress stored in `localStorage` on the student's device.
- All sixteen methodology modules from the supplied `methodology-data.js` are mapped as progressive missions.

## Installation on GitHub

1. Open the `EnglishCollesInLyon` repository.
2. Click **Add file** → **Upload files**.
3. Upload `help.html`, `help-data.js` and `help-engine.js` into the repository root, next to `index.html`.
4. Open the current `index.html` in GitHub and click the pencil icon.
5. Search for: `I’m new to the site`.
6. Find the closing `</a>` of that first route card.
7. Copy the contents of `INDEX-HELP-CARD.html` immediately after that `</a>` and before the card beginning `I have a colle coming up`.
8. Click **Commit changes**.
9. Wait two or three minutes and open `https://lecomteeglantine.github.io/EnglishCollesInLyon/help.html`.

No existing file needs to be deleted.

## Important scope note

This first functional build establishes the complete engine and a 51-skill foundation bank. The next data lots can add every remaining grammar chapter, vocabulary chapter, pronunciation target and Civilisation Lab element without rebuilding the page or the engine.
