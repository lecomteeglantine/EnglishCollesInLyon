#!/usr/bin/env python3
"""Apply the shared English Colles in Lyon header/footer to public HTML pages.

The transformation is idempotent. Core pages keep their former controls in the
DOM but hide them, so their page-specific JavaScript remains harmless and does
not break when it looks up legacy element IDs.
"""
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SHELL_VERSION = "20260723-mission-1"
REVIEW_VERSION = "20260723-review-1"
CORE_PAGES = {
    "index.html", "methodology.html", "civilisation.html", "vocabulary.html",
    "grammar.html", "pronunciation.html", "timelines.html", "colle-trainer.html",
    "resources.html", "jury-reports.html", "learning-path.html", "progress-backup.html", "help.html",
    "flashcards.html", "review.html",
}
EXCLUDED = {
    "SOURCE-methodology.html", "INDEX-HELP-CARD.html", "prototype-colle-atlas-us.html",
    "atlas-engine.html",
}

CSS_LINK = f'<link rel="stylesheet" href="site-shell.css?v={SHELL_VERSION}">'
HEADER_INSERT = (
    '<div id="ecl-site-header"></div>\n'
    f'<script src="review-engine.js?v={REVIEW_VERSION}"></script>\n'
    f'<script src="site-shell.js?v={SHELL_VERSION}"></script>'
)
FOOTER_INSERT = '<div id="ecl-site-footer"></div>'


def is_public_page(path: Path) -> bool:
    name = path.name
    if name in EXCLUDED:
        return False
    return (
        name in CORE_PAGES
        or name.startswith("cpge_grammar_")
        or name.startswith("cpge_vocab_")
        or name.startswith("colle-atlas-")
    )


def add_class(opening_tag: str, class_name: str) -> str:
    class_match = re.search(r'\bclass\s*=\s*(["\'])(.*?)\1', opening_tag, re.I | re.S)
    if class_match:
        classes = class_match.group(2).split()
        if class_name in classes:
            return opening_tag
        replacement = f'class={class_match.group(1)}{class_match.group(2)} {class_name}{class_match.group(1)}'
        return opening_tag[:class_match.start()] + replacement + opening_tag[class_match.end():]
    return re.sub(r'\s*>$', f' class="{class_name}">', opening_tag, count=1)


def mark_first_tag(text: str, tag: str, class_name: str) -> str:
    pattern = re.compile(rf'<{tag}\b[^>]*>', re.I | re.S)
    return pattern.sub(lambda m: add_class(m.group(0), class_name), text, count=1)


def mark_element_by_id(text: str, element_id: str, class_name: str) -> str:
    pattern = re.compile(
        rf'<[a-z][a-z0-9:-]*\b(?=[^>]*\bid\s*=\s*(["\']){re.escape(element_id)}\1)[^>]*>',
        re.I | re.S,
    )
    return pattern.sub(lambda m: add_class(m.group(0), class_name), text, count=1)


def mark_skip_link(text: str) -> str:
    pattern = re.compile(r'<a\b(?=[^>]*\bclass\s*=\s*(["\'])[^"\']*\bskip\b[^"\']*\1)[^>]*>', re.I | re.S)
    return pattern.sub(lambda m: add_class(m.group(0), "ecl-legacy-shell"), text, count=1)


def transform(path: Path) -> tuple[str, bool]:
    original = path.read_text(encoding="utf-8")
    text = original

    # Shared stylesheet and author metadata. Existing cache-busting values are
    # normalised so a shell update is fetched immediately after deployment.
    if "site-shell.css" in text:
        text = re.sub(
            r'<link\b[^>]*href=["\']site-shell\.css(?:\?v=[^"\']*)?["\'][^>]*>',
            CSS_LINK, text, count=1, flags=re.I,
        )
    else:
        text, count = re.subn(r'</head>', CSS_LINK + '\n</head>', text, count=1, flags=re.I)
        if not count:
            text = CSS_LINK + '\n' + text

    if "review-engine.js" in text:
        text = re.sub(
            r'<script\b[^>]*src=["\']review-engine\.js(?:\?v=[^"\']*)?["\'][^>]*>\s*</script>',
            f'<script src="review-engine.js?v={REVIEW_VERSION}"></script>', text, count=1, flags=re.I,
        )
    text = re.sub(
        r'<script\b[^>]*src=["\']site-shell\.js(?:\?v=[^"\']*)?["\'][^>]*>\s*</script>',
        f'<script src="site-shell.js?v={SHELL_VERSION}"></script>', text, count=1, flags=re.I,
    )
    if "review-engine.js" not in text and "site-shell.js" in text:
        text = re.sub(
            r'(<script\b[^>]*src=["\']site-shell\.js(?:\?v=[^"\']*)?["\'][^>]*>\s*</script>)',
            lambda m: f'<script src="review-engine.js?v={REVIEW_VERSION}"></script>\n{m.group(1)}',
            text, count=1, flags=re.I,
        )
    if not re.search(r'<meta\s+name=["\']author["\']', text, re.I):
        text = re.sub(r'</head>', '<meta name="author" content="Eglantine Lecomte">\n</head>', text, count=1, flags=re.I)

    # Preserve old DOM controls for existing scripts, but remove them visually.
    if path.name in CORE_PAGES:
        text = mark_first_tag(text, "header", "ecl-legacy-shell")
        text = mark_first_tag(text, "footer", "ecl-legacy-shell")
        text = mark_skip_link(text)
        for element_id in (
            "scrim", "a11yPanel", "a11yDrawer", "accessibilityPanel",
            "mobileMenu", "menuOverlay",
        ):
            text = mark_element_by_id(text, element_id, "ecl-legacy-shell")

    # Header script is deliberately synchronous: legacy bottom scripts can run
    # normally while the new shell already exists.
    if 'id="ecl-site-header"' not in text:
        text, count = re.subn(
            r'(<body\b[^>]*>)',
            r'\1\n' + HEADER_INSERT,
            text,
            count=1,
            flags=re.I,
        )
        if not count:
            text = HEADER_INSERT + '\n' + text

    # Remove a previous marker wherever it is (older versions could place it
    # inside an exported HTML template literal), then insert it before the
    # final closing body tag, which is the real document boundary.
    text = re.sub(
        r"\n?[ \t]*<div id=\"ecl-site-footer\"></div>[ \t]*\n?",
        "\n",
        text,
    )
    body_closings = list(re.finditer(r"</body>", text, re.I))
    if body_closings:
        closing = body_closings[-1]
        before = text[:closing.start()].rstrip()
        text = before + "\n" + FOOTER_INSERT + "\n" + text[closing.start():]
    else:
        text = text.rstrip() + "\n" + FOOTER_INSERT + "\n"

    return text, text != original


def main() -> None:
    changed = 0
    checked = 0
    for path in sorted(ROOT.glob("*.html")):
        if not is_public_page(path):
            continue
        checked += 1
        updated, did_change = transform(path)
        if did_change:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Shared site shell checked on {checked} public pages; {changed} page(s) updated.")


if __name__ == "__main__":
    main()
