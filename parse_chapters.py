#!/usr/bin/env python3
"""
Parse les chapitres HTML du CPGE English Vocabulary Bible
et produit un fichier vocab-data.js exploitable par le site.

Usage :  python3 parse_chapters.py dossier_des_chapitres/ vocab-data.js
"""
import sys, os, re, json, glob
from html.parser import HTMLParser

class ChapterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.subtitle = ""
        self.sections = []       # [{title, entries:[...]}]
        self._path = []          # pile de (tag, classes)
        self._cur_section = None
        self._cur_entry = None
        self._buf = None         # champ texte en cours de capture
        self._field = None
        self._field_depth = 0    # profondeur de la balise qui a ouvert le champ

    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class", "")
        self._path.append((tag, cls))
        if tag == "h2" and "section-title" in cls:
            self._open("section")
        elif tag == "article" and "card" in cls:
            self._cur_entry = {"term": "", "ipa": "", "pron": "", "fr": "", "def": "", "ex": ""}
        elif self._cur_entry is not None:
            if tag == "h3":
                self._open("term")
            elif tag == "div" and not cls and self._in("div", "meta"):
                self._open("meta")
            elif tag == "p" and "definition" in cls:
                self._open("def")
            elif tag == "p" and "example" in cls:
                self._open("ex")
        elif tag == "h1":
            self._open("h1")

    def _open(self, field):
        self._field = field
        self._buf = []
        self._field_depth = len(self._path)

    def _in(self, tag, cls):
        return any(t == tag and cls in c for t, c in self._path[:-1])

    def handle_endtag(self, tag):
        if self._path: self._path.pop()
        if self._buf is not None and self._field and len(self._path) < self._field_depth:
            text = re.sub(r"\s+", " ", "".join(self._buf)).strip()
            f = self._field
            if f == "h1":
                self.title = text
            elif f == "section":
                self._cur_section = {"title": text, "entries": []}
                self.sections.append(self._cur_section)
            elif f == "term":
                self._cur_entry["term"] = text
            elif f == "meta":
                m = re.match(r"(IPA|Pronunciation|French)\s*:\s*(.*)", text)
                if m:
                    key = {"IPA": "ipa", "Pronunciation": "pron", "French": "fr"}[m.group(1)]
                    self._cur_entry[key] = m.group(2).strip()
            elif f == "def":
                self._cur_entry["def"] = re.sub(r"^Definition\s*:\s*", "", text)
            elif f == "ex":
                self._cur_entry["ex"] = re.sub(r"^Example\s*:\s*", "", text)
            self._buf = None; self._field = None
        if tag == "article" and self._cur_entry is not None:
            if self._cur_entry["term"] and self._cur_section:
                self._cur_section["entries"].append(self._cur_entry)
            self._cur_entry = None

    def handle_data(self, data):
        if self._buf is not None:
            self._buf.append(data)


def parse_file(path):
    p = ChapterParser()
    with open(path, encoding="utf-8") as f:
        p.feed(f.read())
    # Métadonnées depuis le nom de fichier : cpge_vocab_part1_chapter1_political_systems.html
    m = re.search(r"part(\d+)_chapter(\d+)_(.+)\.html$", os.path.basename(path))
    part, chap, slug = (int(m.group(1)), int(m.group(2)), m.group(3)) if m else (0, 0, "")
    title = slug.replace("_", " ").title() if slug else p.title
    n = sum(len(s["entries"]) for s in p.sections)
    return {
        "id": f"p{part}c{chap}",
        "part": part,
        "chapter": chap,
        "title": title,
        "file": os.path.basename(path),
        "count": n,
        "sections": p.sections,
    }


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "."
    out = sys.argv[2] if len(sys.argv) > 2 else "vocab-data.js"
    files = sorted(glob.glob(os.path.join(src, "cpge_vocab_*.html")))
    if not files:
        print(f"Aucun fichier cpge_vocab_*.html trouvé dans {src}"); sys.exit(1)
    chapters = []
    for f in files:
        ch = parse_file(f)
        chapters.append(ch)
        print(f"  {ch['file']}: {ch['count']} entrées, {len(ch['sections'])} sections")
    chapters.sort(key=lambda c: (c["part"], c["chapter"]))
    data = {"chapters": chapters}
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Généré automatiquement par parse_chapters.py — ne pas éditer à la main\n")
        f.write("window.VOCAB = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")
    total = sum(c["count"] for c in chapters)
    print(f"\n{len(chapters)} chapitres, {total} entrées -> {out}")

if __name__ == "__main__":
    main()
