# Spaced Review

`review.html` provides one shared review queue for vocabulary, grammar, civilisation, timelines, pronunciation and jury advice.

## Local data

The queue is stored under `ecl_spaced_review_v1`. Existing vocabulary saves, vocabulary mistakes and grammar chapters marked `revise` are imported by `review-engine.js`.

## Scheduling

- **Again:** ten minutes
- **Difficult:** approximately one day, then a slowly increasing interval
- **Almost there:** a normal increasing interval
- **Mastered:** a longer interval

The interface deliberately avoids points, leagues and invented mastery percentages.

## Generated indexes

Run `python build_search_index.py` to rebuild both search indexes and both review indexes.
