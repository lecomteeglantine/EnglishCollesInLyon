# Shared navigation — English Colles in Lyon

This update adds a common site header, navigation menu, accessibility panel and footer to every public student page.

## Shared files

- `site-shell.css` — appearance of the common header, menu, accessibility panel and footer.
- `site-shell.js` — navigation, active-page detection, mobile menu, accent choice and accessibility preferences.
- `apply_site_shell.py` — idempotent script that inserts the shared shell into all public HTML pages.

## Pages covered

The script covers the main pages, all grammar chapters, all vocabulary chapters, all country atlases and the vocabulary flashcards page. Specialist chapter and atlas toolbars are preserved beneath the shared site navigation.

## Future updates

Run:

```bash
python3 apply_site_shell.py
```

The script can safely be run repeatedly. The GitHub Actions build workflow also runs it after regenerated content, so the common navigation is not lost when an atlas is rebuilt.

A manual workflow is available under **Actions → Apply shared site navigation**.

## Uploading this update

Upload the complete contents of this package to the root of the `EnglishCollesInLyon` repository and replace files when GitHub asks. The service-worker version has been changed so browsers fetch the new shared assets instead of retaining the former navigation.
