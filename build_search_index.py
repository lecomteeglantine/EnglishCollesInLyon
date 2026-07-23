#!/usr/bin/env python3
"""Build the global search index for English Colles in Lyon.

The generated index combines the public site structure with the structured
Grammar, Vocabulary, Methodology, Civilisation, Timeline, Resources and Jury
Reports datasets. Run it whenever teaching content is added or regenerated.
"""
from __future__ import annotations

from bs4 import BeautifulSoup
from datetime import datetime, timezone
from hashlib import sha1
from pathlib import Path
from json import JSONDecoder
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "search-index.json"
VOCAB_OUTPUT = ROOT / "search-vocabulary-index.json"

CORE_PAGES = {
    "index.html": ("Home", "Start here, choose a learning route and continue your work."),
    "methodology.html": ("Methodology", "Learn how to understand, contextualise, summarise, problematise and discuss a document."),
    "civilisation.html": ("Civilisation", "Explore the history, institutions and current debates of major English-speaking countries."),
    "vocabulary.html": ("Vocabulary", "Build and review the vocabulary needed for press analysis, argumentation and colles."),
    "grammar.html": ("Grammar", "Choose a structured grammar path and practise accurate English for oral examinations."),
    "pronunciation.html": ("Pronunciation", "Improve sounds, stress, rhythm, intonation and oral delivery through guided practice."),
    "timelines.html": ("Timelines", "Search verified historical milestones across eight English-speaking countries."),
    "colle-trainer.html": ("Colle Trainer", "Prepare a complete oral task with documents, timing, prompts and feedback."),
    "resources.html": ("Resources", "Find reliable news, podcasts, videos, institutions and reference sources."),
    "jury-reports.html": ("Jury Reports", "Turn recurring examiner feedback into practical preparation actions."),
    "learning-path.html": ("My Learning Path", "See your progress, priorities, review queue and most useful next step."),
    "progress-backup.html": ("Progress backup", "Export, import and protect the progress saved on this device."),
    "help.html": ("Guided Learning Plan", "Follow a clear progressive plan when you need more structure or confidence."),
    "flashcards.html": ("Vocabulary flashcards", "Review vocabulary actively in English and French."),
}

CORE_SECTION_FILES = {
    "index.html", "methodology.html", "civilisation.html", "pronunciation.html",
    "colle-trainer.html", "resources.html", "jury-reports.html", "help.html",
    "learning-path.html", "progress-backup.html", "timelines.html",
}

GENERIC_HEADINGS = {
    "home", "menu", "accessibility", "start here", "learn more", "resources",
    "practice", "progress", "introduction", "conclusion", "your turn",
}

COUNTRY_NAMES = {
    "gb": "United Kingdom", "us": "United States", "ie": "Ireland",
    "ca": "Canada", "au": "Australia", "nz": "New Zealand",
    "in": "India", "za": "South Africa",
}


def read_assignment(path: Path):
    text = path.read_text(encoding="utf-8")
    pos = text.find("=")
    if pos < 0:
        raise ValueError(f"No assignment found in {path.name}")
    decoder = JSONDecoder()
    value, _ = decoder.raw_decode(text[pos + 1:].lstrip())
    return value


def clean(value, limit: int = 320) -> str:
    text = BeautifulSoup(str(value or ""), "html.parser").get_text(" ", strip=True)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[: limit - 1].rstrip() + "…"
    return text


def normalise(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower().replace("’", "'").replace("–", "-").replace("—", "-")
    value = re.sub(r"[^a-z0-9'\- ]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


entries: list[dict] = []
vocab_terms: list[list] = []
vocab_chapters: list[dict] = []
seen: set[tuple[str, str, str]] = set()


def add(*, title: str, category: str, url: str, description: str = "",
        context: str = "", target: str = "", keywords=(), priority: int = 50):
    title = clean(title, 150)
    description = clean(description, 240)
    context = clean(context, 120)
    target = clean(target, 150)
    if not title or not url:
        return
    key = (normalise(title), url, normalise(target))
    if key in seen:
        return
    seen.add(key)
    keyword_text = clean(" ".join(str(k) for k in keywords if k), 700)
    ident = sha1("|".join(key).encode("utf-8")).hexdigest()[:12]
    entries.append({
        "id": ident,
        "title": title,
        "category": category,
        "context": context,
        "description": description,
        "url": url,
        "target": target,
        "keywords": keyword_text,
        "priority": priority,
    })


# Main pages and carefully selected visible sections.
for filename, (title, description) in CORE_PAGES.items():
    if (ROOT / filename).exists():
        add(title=title, category="Page", url=filename, description=description,
            context="English Colles in Lyon", keywords=[title, description], priority=100)

for filename in CORE_SECTION_FILES:
    path = ROOT / filename
    if not path.exists():
        continue
    soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    for tag in soup.find_all(["h2", "h3"]):
        title = clean(tag.get_text(" ", strip=True), 110)
        norm = normalise(title)
        if not title or len(title) < 5 or len(title) > 105 or norm in GENERIC_HEADINGS:
            continue
        # Do not index quiz answer headings or repeated card boilerplate.
        cls = " ".join(tag.get("class", []))
        if any(word in cls.lower() for word in ("feedback", "answer", "modal")):
            continue
        parent_text = clean(tag.parent.get_text(" ", strip=True) if tag.parent else "", 230)
        add(title=title, category="Section", url=filename, target=title,
            description=parent_text, context=CORE_PAGES.get(filename, (filename, ""))[0],
            keywords=[title, parent_text], priority=62)


# Grammar chapters.
grammar = read_assignment(ROOT / "grammar-data.js")
for chapter in grammar:
    number = chapter.get("n")
    title = chapter.get("title", "")
    file = chapter.get("file", "grammar.html")
    desc = chapter.get("desc", "")
    track = chapter.get("track", "")
    add(title=title, category="Grammar", url=file, target=title,
        description=desc, context=f"Grammar · Chapter {number}",
        keywords=[title, desc, track, "grammar rule exercise colle"], priority=84)


# Vocabulary chapters and all terms, including French equivalents for retrieval.
vocab = read_assignment(ROOT / "vocab-data.js")
for chapter in vocab.get("chapters", []):
    chapter_title = chapter.get("title", "")
    chapter_file = chapter.get("file", "vocabulary.html")
    chapter_no = chapter.get("chapter", "")
    part = chapter.get("part", "")
    add(title=chapter_title, category="Vocabulary", url=chapter_file, target=chapter_title,
        description=f"Vocabulary chapter with {chapter.get('count', 0)} entries.",
        context=f"Vocabulary · Part {part} · Chapter {chapter_no}",
        keywords=[chapter_title, "vocabulary flashcards colle"], priority=80)
    chapter_index = len(vocab_chapters)
    vocab_chapters.append({"title": chapter_title, "file": chapter_file})
    for section in chapter.get("sections", []):
        section_title = section.get("title", "")
        for item in section.get("entries", []):
            term = clean(item.get("term", ""), 100)
            french = clean(item.get("fr", ""), 120)
            if term:
                # Compact dedicated index: [English term, French equivalent, chapter index, section].
                vocab_terms.append([term, french, chapter_index, clean(section_title, 90)])


# Methodology modules, lesson sections and tools.
methodology = read_assignment(ROOT / "methodology-data.js")
for module in methodology.get("modules", []):
    title = module.get("title", "")
    lead = module.get("lead", "")
    number = module.get("n", "")
    skill = module.get("skill", "")
    add(title=title, category="Methodology", url="methodology.html", target=title,
        description=lead, context=f"Methodology · Module {number} · {skill}",
        keywords=[title, lead, skill, "colle oral exam jury"], priority=91)
    for lesson in module.get("lesson", []):
        heading = lesson.get("h", "")
        paragraph = lesson.get("p", "")
        add(title=heading, category="Methodology", url="methodology.html", target=heading,
            description=paragraph, context=title,
            keywords=[heading, paragraph, title, skill], priority=73)
for tool_id, tool in methodology.get("tools", {}).items():
    if isinstance(tool, dict):
        title = tool.get("title") or tool_id.replace("_", " ").title()
        description = tool.get("intro") or tool.get("lead") or tool.get("description") or "Interactive methodology tool."
        add(title=title, category="Methodology tool", url="methodology.html", target=title,
            description=description, context="Interactive practice",
            keywords=[title, description, tool_id], priority=85)


# Timelines and country pages.
timelines = read_assignment(ROOT / "timeline-data.js")
for code, country in timelines.items():
    name = country.get("name") or COUNTRY_NAMES.get(code, code.upper())
    atlas_file = f"colle-atlas-{code}.html"
    if (ROOT / atlas_file).exists():
        add(title=name, category="Civilisation", url=atlas_file,
            description=country.get("strap", "Country civilisation atlas."),
            context="Country atlas", keywords=[name, country.get("strap", "")], priority=94)
    for event in country.get("events", []):
        title = event.get("title", "")
        date = event.get("date", event.get("year", ""))
        description = " ".join(filter(None, [event.get("summary", ""), event.get("why", "")]))
        add(title=title, category="Timeline", url=f"timelines.html?country={code}", target=title,
            description=description, context=f"{name} · {date}",
            keywords=[title, date, name, event.get("what", ""), event.get("why", ""),
                      " ".join(event.get("keywords", [])), event.get("colle", "")],
            priority=88)


# Curated resources.
resources_path = ROOT / "resources-data.json"
if resources_path.exists():
    resources = json.loads(resources_path.read_text(encoding="utf-8"))
    for item in resources.get("resources", []):
        title = item.get("title", "")
        countries = ", ".join(item.get("countries", []))
        topics = ", ".join(item.get("topics", []))
        fmt = item.get("format", "Resource")
        access = item.get("access", "")
        description = f"{fmt} source for {topics or 'English-speaking world research'}. {access} access."
        add(title=title, category="Resource", url="resources.html", target=title,
            description=description, context=countries or "International",
            keywords=[title, countries, topics, fmt, access, item.get("kind", ""), " ".join(item.get("badges", []))],
            priority=68)


# Jury reports: recurrent warnings, competition formats and practical actions.
jury_path = ROOT / "jury-reports-data.json"
if jury_path.exists():
    jury = json.loads(jury_path.read_text(encoding="utf-8"))
    for item in jury.get("warnings", []):
        label = item.get("label", "")
        detail = " ".join(clean(v, 150) for k, v in item.items() if k not in {"id", "label"} and isinstance(v, str))
        add(title=label, category="Jury report", url="jury-reports.html", target=label,
            description=detail, context="Recurring examiner warning",
            keywords=[label, detail, "jury examiner oral exam mistake"], priority=86)
    for competition in jury.get("competitions", []):
        name = competition.get("name", competition.get("short", ""))
        short = competition.get("short", "")
        fmt = competition.get("format", "")
        add(title=name, category="Jury report", url="jury-reports.html", target=short or name,
            description=fmt, context=f"{short} · Official expectations",
            keywords=[name, short, fmt, " ".join(competition.get("do", [])),
                      " ".join(competition.get("avoid", [])), " ".join(competition.get("recommend", []))],
            priority=82)
    for action in jury.get("actions", []):
        warning = action.get("warning", "")
        work = action.get("work", "")
        url = action.get("url") or "jury-reports.html"
        add(title=warning, category="Jury action", url=url, target=warning,
            description=work, context="Turn feedback into practice",
            keywords=[warning, work, "jury action practice"], priority=87)


# Pronunciation lesson cards and video titles from the published page.
pronunciation_path = ROOT / "pronunciation.html"
if pronunciation_path.exists():
    soup = BeautifulSoup(pronunciation_path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    for tag in soup.find_all(["h2", "h3", "h4"]):
        title = clean(tag.get_text(" ", strip=True), 110)
        if len(title) < 5 or len(title) > 105 or normalise(title) in GENERIC_HEADINGS:
            continue
        parent = tag.find_parent(["article", "section", "div"])
        description = clean(parent.get_text(" ", strip=True) if parent else "", 240)
        add(title=title, category="Pronunciation", url="pronunciation.html", target=title,
            description=description, context="Video lesson or practice studio",
            keywords=[title, description, "sounds stress rhythm intonation pronunciation"], priority=76)


# Stable ordering makes diffs readable and keeps high-value suggestions first.
entries.sort(key=lambda item: (-item["priority"], normalise(item["title"]), item["url"]))
generated = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
payload = {"version": 1, "generatedAt": generated, "count": len(entries), "entries": entries}
OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
vocab_payload = {"version": 1, "generatedAt": generated, "count": len(vocab_terms),
                 "chapters": vocab_chapters, "entries": vocab_terms}
VOCAB_OUTPUT.write_text(json.dumps(vocab_payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Core search index: {len(entries):,} entries, {OUTPUT.stat().st_size / 1024:.1f} KiB")
print(f"Vocabulary index: {len(vocab_terms):,} entries, {VOCAB_OUTPUT.stat().st_size / 1024:.1f} KiB")
