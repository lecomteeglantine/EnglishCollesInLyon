from pathlib import Path
import re

STYLE = """<style id="ecl-author-signature-style">
.ecl-author-byline{
  display:block!important;
  margin-top:2px!important;
  font-family:"Atkinson Hyperlegible",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;
  font-size:.66rem!important;
  line-height:1.2!important;
  font-weight:700!important;
  letter-spacing:.055em!important;
  color:#C46A4A!important;
  text-transform:none!important;
}
.ecl-site-signature{
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:1px!important;
  width:100%!important;
  min-height:54px!important;
  padding:7px 16px!important;
  margin:0!important;
  border:0!important;
  border-radius:0!important;
  background:#243B53!important;
  color:#fff!important;
  text-decoration:none!important;
  text-align:center!important;
  box-shadow:none!important;
  font-family:"Atkinson Hyperlegible",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;
}
.ecl-site-signature:hover{background:#2f5573!important;color:#fff!important}
.ecl-site-signature .ecl-site-title{
  font-family:Georgia,"Times New Roman",serif!important;
  font-size:1.03rem!important;
  line-height:1.15!important;
  font-weight:700!important;
}
.ecl-site-signature .ecl-site-author{
  font-size:.7rem!important;
  line-height:1.2!important;
  font-weight:700!important;
  letter-spacing:.055em!important;
  color:#F1C66A!important;
}
.ecl-author-footer{
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  justify-content:center!important;
  gap:.35em!important;
  width:100%!important;
  max-width:1120px!important;
  margin:18px auto 0!important;
  padding:14px 16px 0!important;
  border-top:1px dashed rgba(122,155,118,.55)!important;
  color:#5d6b66!important;
  background:transparent!important;
  text-align:center!important;
  font-family:"Atkinson Hyperlegible",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;
  font-size:.82rem!important;
  line-height:1.45!important;
}
.ecl-author-footer strong{color:#243B53!important;font-weight:700!important}
footer.ecl-generated-footer{
  display:block!important;
  width:100%!important;
  margin:0!important;
  padding:22px 16px!important;
  border-top:1px solid #E6D8C8!important;
  background:#FFF7ED!important;
}
footer.ecl-generated-footer .ecl-author-footer{
  margin:0 auto!important;
  padding-top:0!important;
  border-top:0!important;
}
</style>"""

TOP_BANNER = """<a class="ecl-site-signature" href="index.html" aria-label="English Colles in Lyon — accueil">
  <span class="ecl-site-title">English Colles in Lyon</span>
  <span class="ecl-site-author">by Eglantine Lecomte</span>
</a>"""

BOTTOM = """<div class="ecl-author-footer">
  <span>Designed and created by</span>
  <strong>Eglantine Lecomte</strong>
  <span>· English Colles in Lyon</span>
</div>"""

def has_actual_class(text: str, class_name: str) -> bool:
    """Detect an actual HTML element class, not a class name inside CSS."""
    pattern = rf'<[^>]+\bclass=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\']'
    return bool(re.search(pattern, text, re.I))

def update_page(text: str) -> tuple[str, bool]:
    changed = False

    if not re.search(r'<meta\s+name=["\']author["\']', text, re.I):
        text, count = re.subn(
            r'</head>',
            '  <meta name="author" content="Eglantine Lecomte">\n'
            + STYLE + '\n</head>',
            text,
            count=1,
            flags=re.I,
        )
        changed |= bool(count)
    elif 'id="ecl-author-signature-style"' not in text:
        text, count = re.subn(
            r'</head>',
            STYLE + '\n</head>',
            text,
            count=1,
            flags=re.I,
        )
        changed |= bool(count)

    has_byline = has_actual_class(text, "ecl-author-byline")
    has_banner = has_actual_class(text, "ecl-site-signature")

    if not has_byline and not has_banner:
        brand_pattern = r'(<span\s+class=["\']name["\']\s*>\s*English Colles in Lyon\s*</span>)'
        if re.search(brand_pattern, text, re.I):
            text, count = re.subn(
                brand_pattern,
                r'\1\n      <span class="ecl-author-byline">by Eglantine Lecomte</span>',
                text,
                count=1,
                flags=re.I,
            )
            changed |= bool(count)
        else:
            text, count = re.subn(
                r'(<body\b[^>]*>)',
                r'\1\n' + TOP_BANNER,
                text,
                count=1,
                flags=re.I,
            )
            changed |= bool(count)

    old_copyright = r'(?:©|&copy;)\s*Eglantine Lecomte\s*[—–-]\s*English Colles in Lyon\.?'
    if re.search(old_copyright, text, re.I):
        text, count = re.subn(
            old_copyright,
            'Designed and created by <strong>Eglantine Lecomte</strong> · English Colles in Lyon.',
            text,
            flags=re.I,
        )
        changed |= bool(count)

    has_footer_credit = has_actual_class(text, "ecl-author-footer") or bool(re.search(
        r'Designed and created by\s*(?:<strong>)?Eglantine Lecomte',
        text,
        re.I,
    ))

    if not has_footer_credit:
        footer_closings = list(re.finditer(r'</footer>', text, re.I))
        if footer_closings:
            closing = footer_closings[-1]
            text = text[:closing.start()] + BOTTOM + "\n" + text[closing.start():]
            changed = True
        else:
            text, count = re.subn(
                r'</body>',
                '<footer class="ecl-generated-footer">\n'
                + BOTTOM
                + '\n</footer>\n</body>',
                text,
                count=1,
                flags=re.I,
            )
            changed |= bool(count)

    return text, changed

modified = 0
for page in Path(".").rglob("*.html"):
    original = page.read_text(encoding="utf-8")
    updated, changed = update_page(original)
    if changed:
        page.write_text(updated, encoding="utf-8")
        modified += 1

print(f"{modified} HTML page(s) updated.")
